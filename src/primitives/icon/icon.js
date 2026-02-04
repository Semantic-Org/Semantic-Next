import { defineComponent } from '@semantic-ui/component';

import css from './icon-bundle.css?raw';
import template from './icon.html?raw';
import componentSpec from './specs/icon.component.js';

const createComponent = ({ settings }) => ({
  getIconStyle: () => {
    const { icon, set } = settings;
    if (set) {
      return `
        --icon-mask: var(--icon-${icon}, var(--icon-${set}));
        --icon-image: var(--icon-${icon}-image, var(--icon-${set}-image));
        --icon-bg: var(--icon-${icon}-bg, var(--icon-${set}-bg));
        --icon-glyph: var(--icon-${icon}-glyph, var(--icon-${set}-glyph));
      `;
    }
    return `
      --icon-mask: var(--icon-${icon});
      --icon-image: var(--icon-${icon}-image);
      --icon-bg: var(--icon-${icon}-bg);
      --icon-glyph: var(--icon-${icon}-glyph);
    `;
  },
});

const UIIcon = defineComponent({
  tagName: 'ui-icon',
  componentSpec,
  template,
  css,
  createComponent,
});

export { UIIcon };
