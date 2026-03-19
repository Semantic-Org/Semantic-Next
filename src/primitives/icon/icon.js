import { defineComponent } from '@semantic-ui/component';

import css from './icon-bundle.css?raw';
import template from './icon.html?raw';
import componentSpec from './specs/icon.component.js';
const createComponent = ({ settings, data, self }) => ({
  // support either <ui-icon set="baz" or <ui-icon icon="icon:baz">
  getIconParts() {
    if (settings.set) {
      const { icon, set } = settings;
      return { icon, set };
    }
    const parts = (settings.icon || '').split(':');
    return {
      set: parts[1],
      icon: parts[0],
    };
  },
  maybeCustomIcon() {
    // if this icon is not in standard set include it additionally
    if (data.ui.search(settings.icon) == -1) {
      return ' ' + settings.icon;
    }
  },
  getIconStyle() {
    const { icon, set } = self.getIconParts();
    if (set) {
      return `
        --icon-mask: var(--icon-${icon}, var(--icon-${set}));
        --icon-bg-image: var(--icon-${icon}-img, var(--icon-${set}-img));
        --icon-bg: var(--icon-${icon}-bg, var(--icon-${set}-bg));
        --icon-glyph: var(--icon-${icon}-glyph, var(--icon-${set}-glyph));
      `;
    }
    return `
      --icon-mask: var(--icon-${icon});
      --icon-bg-image: var(--icon-${icon}-img);
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
