import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { any, isFunction, first, isArray } from '@semantic-ui/utils';
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
    getActiveID() {
      const activeItem = first(settings.menu, (item) => tpl.isActiveItem(item));
      return activeItem?._id;
    },
    isActiveItem(item) {
      let activeURL = tpl.url.get();
      if(item.baseURLs && any(item.baseURLS, (baseURL) => activeURL.startsWith(baseURL))) {
        return true;
      }
      if(item.baseURL && activeURL.startsWith(item.baseURL)) {
        return true;
      }
      if (item?.url === tpl.url.get()) {
        return true;
      }
      return false;
    },
    // the current url is the link from this topbar menu
    isCurrentItem(item) {
      const url = tpl.url.get();
      if(item.activeURL) {
        return isArray(item.activeURL)
          ? any(item.activeURL, (activeURL) => url.startsWith(activeURL))
          : url.startsWith(item.activeURL)
        ;
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
