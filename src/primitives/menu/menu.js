import { defineComponent } from '@semantic-ui/component';
import { findIndex } from '@semantic-ui/utils';

import css from './menu-bundle.css?raw';
import pageCSS from './menu-page.css?raw';
import template from './menu.html?raw';
import componentSpec from './specs/menu.component.js';

const createComponent = ({ settings, self, $$, el, dispatchEvent, isServer }) => ({
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
    if (isServer) {
      return;
    }
    const $items = $$(el).find('menu-item');
    const values = $items.val();
    const activeIndex = findIndex(values, value);
    const $item = $items.eq(activeIndex);
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

const onRendered = function({ settings, self }) {
  if (settings.value) {
    self.setValue(settings.value);
  }
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
