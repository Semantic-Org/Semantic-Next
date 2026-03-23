import { defineComponent } from '@semantic-ui/component';
import { findIndex } from '@semantic-ui/utils';
import { Transition } from '../../behaviors/index.js';

import css from './menu-bundle.css?raw';
import pageCSS from './menu-page.css?raw';
import template from './menu.html?raw';
import componentSpec from './specs/menu.component.js';

const defaultState = {
  activeIndex: -1,
};

const createComponent = ({ $, settings, self, $$, el, state, dispatchEvent, isServer }) => ({
  setValue(value) {
    settings.value = value;
    dispatchEvent('change', { value });
    self.selectValue(value);
  },

  getValue(item) {
    return item.value || item.href;
  },

  isCurrentValue(currentValue, item) {
    if (item.active) {
      return true;
    }
    if (currentValue !== undefined) {
      return currentValue == self.getValue(item);
    }
    return false;
  },

  selectValue(value) {
    if (isServer) {
      return;
    }
    const $item = self.getItemByValue(value);
    self.selectItem($item);
    state.activeIndex.set($item);
  },

  // reactivity will also pick this up when item changes
  selectItem($item) {
    const $items = self.getMenuItems();
    if ($item?.exists()) {
      $items.removeAttr('active');
      $item.attr('active', '');
    }
  },

  getIndicatorPosition(index = self.getActiveIndex()) {
    if (isServer || self.getActiveIndex() == -1) {
      return 'opacity: 0;';
    }
    const $item = self.getActiveItem();
    if (!$item.exists()) {
      return;
    }
    const position = $item.position('local');
    const width = $item.width();
    return `
      left: ${position.local?.left}px;
      width: ${width}px;
    `;
  },

  selectIndex(eq) {
    const value = $$('menu-item').eq(eq).attr('value');
    if (value !== undefined) {
      self.setValue(value);
    }
  },

  getMenuItems() {
    return $$(el).find('menu-item');
  },
  getItemValues() {
    return self.getMenuItems().val();
  },
  getActiveIndex() {
    return state.activeIndex.get();
  },
  getActiveItem() {
    return self.getItemByValue(settings.value);
  },
  getItemIndex(value) {
    return findIndex(self.getItemValues(), value);
  },
  getItemByValue(value) {
    const index = findIndex(self.getItemValues(), value);
    return self.getItemByIndex(index);
  },
  getItemByIndex(index) {
    return self.getMenuItems().eq(index);
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
  defaultState,
  createComponent,
  events,
  onCreated,
  onRendered,
});

export { UIMenu };
