import { defineComponent } from '@semantic-ui/component';
import { isFunction } from '@semantic-ui/utils';

import css from './component.css?raw';
import template from './component.html?raw';
const defaultSettings = {
  selector: '',
  items: [], // Array of menu items
  width: 180, // Default menu width
};

const defaultState = {
  visible: false,
  activeIndex: -1,
};

const createComponent = ({ self, state, settings, $, dispatchEvent }) => ({
  showMenu(event) {
    state.visible.set(true);
    state.activeIndex.set(-1);
    event.preventDefault();

    // Wait for the menu to render, then position it at the cursor and keep it on-screen
    requestAnimationFrame(() => self.positionMenu(event.clientX, event.clientY));
    dispatchEvent('show');
  },

  hideMenu() {
    if (!state.visible.get()) { return; }
    state.visible.set(false);
    dispatchEvent('hide');
  },

  positionMenu(x, y) {
    const $menu = $('.menu');
    if (!$menu.exists()) { return; }

    // 'global' anchors the fixed-position menu to viewport coordinates (matches event.clientX/Y)
    $menu.position({ type: 'global', top: y, left: x });

    const menu = $menu.bounds();
    const viewport = $(window).dimensions();

    const overflowX = Math.max(menu.right - viewport.right + 5, 0);
    const overflowY = Math.max(menu.bottom - viewport.bottom + 5, 0);
    if (overflowX || overflowY) {
      $menu.position({ type: 'global', top: y - overflowY, left: x - overflowX });
    }
  },

  selectItem(item, index) {
    // Execute item action if available
    if (isFunction(item.action)) {
      item.action();
    }

    // Dispatch event with item data
    dispatchEvent('select', { item, index });

    // Hide menu
    self.hideMenu();
  },

  navigateNext() {
    const newIndex = (state.activeIndex.get() + 1) % settings.items.length;
    state.activeIndex.set(newIndex);
  },

  navigatePrevious() {
    const items = settings.items;
    const newIndex = (state.activeIndex.get() - 1 + items.length) % items.length;
    state.activeIndex.set(newIndex);
  },

  selectCurrent() {
    const items = settings.items;
    const index = state.activeIndex.get();
    if (index >= 0 && index < items.length && !items[index].divider) {
      self.selectItem(items[index], index);
    }
  },
});

const keys = {
  'esc': ({ self, state }) => {
    if (!state.visible.get()) {
      return false;
    }
    self.hideMenu();
    return true; // Prevent default
  },
  'down': ({ self, state }) => {
    if (!state.visible.get()) {
      return false;
    }
    self.navigateNext();
    return true;
  },
  'up': ({ self, state }) => {
    if (!state.visible.get()) {
      return false;
    }
    self.navigatePrevious();
    return true;
  },
  'enter': ({ self, state }) => {
    if (!state.visible.get()) {
      return false;
    }
    self.selectCurrent();
    return true;
  },
};

const events = {
  'deep contextmenu .trigger'({ self, event }) {
    self.showMenu(event);
    event.preventDefault();
    event.stopPropagation();
  },

  'global contextmenu body'({ self }) {
    self.hideMenu();
  },

  'global show context-menu'({ self, el, target }) {
    if (el === target) {
      return;
    }
    self.hideMenu();
  },

  'global click body'({ self }) {
    self.hideMenu();
  },

  'mousedown .item'({ event }) {
    event.stopPropagation();
  },

  'click .item'({ self, settings, data }) {
    self.selectItem(data.item, data.index);
    return false;
  },

  'mouseenter .item'({ state, data }) {
    state.activeIndex.set(data.index);
  },
};

export const ContextMenu = defineComponent({
  tagName: 'context-menu',
  template,
  css,
  defaultSettings,
  defaultState,
  events,
  createComponent,
  keys,
});
