import { defineComponent } from '@semantic-ui/component';

import css from './menu-bundle.css?raw';
import pageCSS from './menu-page.css?raw';
import template from './menu.html?raw';
import componentSpec from './specs/menu.component.js';

const createComponent = ({ settings, self, $$, el, dispatchEvent }) => ({
  setValue(value) {
    settings.value = value;
    dispatchEvent('change', { value });
    self.selectValue(value);
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

  selectValue(value) {
    const $items = $$(el).find('menu-item');
    const $item = $items.filter(`[value="${value}"]`).first();
    if ($item.exists()) {
      $items.removeAttr('active');
      $item.attr('active', '');
    }
  },

  selectIndex(eq) {
    const value = $$('menu-item').eq(eq).attr('value');
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
  'deep click menu-item'({ self, value }) {
    if (value !== undefined) {
      self.setValue(value);
    }
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
