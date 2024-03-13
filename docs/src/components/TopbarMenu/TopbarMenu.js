import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { any, isFunction, isArray } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';
import template from './TopbarMenu.html?raw';
import css from './TopbarMenu.css?raw';

const settings = {
  menu: [],
  activeURL: '',
};

const createInstance = function ({ tpl, settings }) {
  return {
    url: new ReactiveVar(settings.activeURL),
    getMenu() {
      return settings.menu;
    },
    getItemStates(item) {
      const classes = [];
      if (tpl.isActiveItem(item)) {
        classes.push('active');
      }
      return classes;
    },
    shouldShow(item) {
      if (isFunction(item.shouldShow)) {
        return item.shouldShow || false;
      }
      return true;
    },
    getLink(item) {
      if (!tpl.isCurrentItem(item)) {
        return item?.url;
      }
      return;
    },
    isActiveItem(item) {
      if (tpl.isCurrentItem(item)) {
        return true;
      }
      if (isArray(item.pages)) {
        return any(item.pages, tpl.isActiveItem);
      }
    },
    isCurrentItem(item) {
      const url = tpl.url.get();
      if(item.baseURL) {
        return url.startsWith(item.baseURL);
      }
      if (item?.url === tpl.url.get()) {
        return true;
      }
    },
    onPageChange() {
      tpl.url.set(window.location.pathname);
    }
  };
};


const onRendered = function ({ $, tpl, isClient }) {
  if(isClient) {
    $(document).on('astro:after-swap', tpl.onPageChange);
  }
};

const events = {
};

const TopbarMenu = createComponent({
  tagName: 'topbar-menu',
  template,
  css,
  createInstance,
  settings,
  onRendered,
  events,
});

export default TopbarMenu;
export { TopbarMenu };
