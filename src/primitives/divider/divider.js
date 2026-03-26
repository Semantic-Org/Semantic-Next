import { defineComponent } from '@semantic-ui/component';

import css from './divider-bundle.css?raw';
import template from './divider.html?raw';
import componentSpec from './specs/divider.component.js';

const createComponent = ({ self, settings }) => ({
  hasContent() {
    return !!(settings.text || settings.icon);
  },

  getDividerClasses() {
    return {
      'horizontal': self.hasContent(),
      // Additional computed classes based on content or logic
      // (spec attributes like vertical, hidden are handled by {ui})
    };
  },

  getOrientation() {
    return settings.vertical ? 'vertical' : 'horizontal';
  },

  getAriaProp(propName) {
    const hasContent = self.hasContent();
    const lookup = {
      'role': (hasContent) ? 'separator' : false,
      'aria-orientation': (hasContent) ? self.getOrientation() : false,
      'aria-hidden': (hasContent) ? false : 'true',
    };
    return lookup[propName] || false;
  },
});

const UIDivider = defineComponent({
  tagName: 'ui-divider',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UIDivider };
