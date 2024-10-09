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

const createInstance = function ({ self, settings }) {
  return {
    url: new ReactiveVar(settings.activeURL),
    getMenu() {
      return settings.menu;
    },
    getItemStates(item) {
      return {
        active: self.isActiveItem(item)
      };
    },
    shouldShow(item) {
      if (isFunction(item.shouldShow)) {
        return item.shouldShow || false;
      }
      return true;
    },
    getLink(item) {
      if (!self.isCurrentItem(item)) {
        return item?.url;
      }
      return;
    },
    getActiveID() {
      const activeItem = first(settings.menu, (item) => self.isActiveItem(item));
      return activeItem?._id;
    },
    isActiveItem(item) {
      let activeURL = self.url.get();
      if(isArray(item.baseURLs) && any(item.baseURLs, baseURL => activeURL.startsWith(baseURL))) {
        return true;
      }
      if(item.baseURL && activeURL.startsWith(item.baseURL)) {
        return true;
      }
      if (item?.url === activeURL) {
        return true;
      }
      return false;
    },
    // the current url is the link from this topbar menu
    isCurrentItem(item) {
      const url = self.url.get();
      if(item.activeURL) {
        return isArray(item.activeURL)
          ? any(item.activeURL, (activeURL) => url.startsWith(activeURL))
          : url.startsWith(item.activeURL)
        ;
      }
      if (item?.url === self.url.get()) {
        return true;
      }
    },
    onPageChange() {
      self.url.set(window.location.pathname);
    }
  };
};


const onRendered = function ({ $, self, attachEvent, isClient }) {
  if(isClient) {
    attachEvent(document, 'astro:after-swap', self.onPageChange);
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
