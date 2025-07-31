import { defineComponent } from '@semantic-ui/component';

import componentSpec from './specs/menu-component.json' with { type: 'json' };
import template from './menu.html?raw';
import css from './menu-bundle.css?raw';
import pageCSS from './menu-page.css?raw';

const createComponent = ({ settings, self, $, dispatchEvent }) => ({
  setValue(value) {
    settings.value = value;
    dispatchEvent('change', { value });
  },

  getValue(item) {
    return item.value || item.href;
  },

  isValueActive(activeValue, item) {
    if (item.active) {
      return true;
    }
    if (activeValue !== undefined) {
      return activeValue == self.getValue(item);
    }
    return false;
  },

  selectIndex(eq) {
    const value = $('menu-item').eq(eq).attr('data-value');
    if (value !== undefined) {
      self.setValue(value);
    }
  },
});

const onCreated = ({ settings }) => {
};

const onRendered = function({ $ }) {
};

const events = {
  'click menu-item'({ self, data }) {
    self.setValue(data.value);
  },
};

const UIMenu = defineComponent({
  tagName: 'ui-menu',
  componentSpec,
  template,
  css,
  pageCSS,
  createComponent,
  events,
  onCreated,
  onRendered,
});

export { UIMenu };
