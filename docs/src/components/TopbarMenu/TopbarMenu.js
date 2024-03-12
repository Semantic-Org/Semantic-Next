import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { any, isFunction, isArray } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';
import template from './TopbarMenu.html?raw';
import css from './TopbarMenu.css?raw';

const settings = {
  menu: [],
  linkCurrentPage: false,
  activeURL: '',
};

const createInstance = function ({ tpl, settings }) {
  return {
    url: new ReactiveVar(settings.activeURL),
    getMenu() {
      return tpl.filterVisibleSections(settings.menu);
    },
    getItemStates(title) {
      const classes = [];
      if (tpl.isActiveItem(title)) {
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
    filterVisibleSections(menu = []) {
      return menu.reduce((acc, { pages, shouldShow, ...item }) => {
        if (isFunction(shouldShow) && !shouldShow()) {
          return acc;
        }
        // recursively filter pages
        const filteredPages = isArray(pages)
          ? tpl.filterVisibleSections(pages)
          : [];
        const result =
          filteredPages.length > 0 ? { ...item, pages: filteredPages } : item;
        acc.push(result);
        return acc;
      }, []);
    },
    getLink(item) {
      if (settings.linkCurrentPage || !tpl.isCurrentItem(item)) {
        return item?.url;
      }
      return;
    },
    isLinkItem(item) {
      return item.url && !tpl.isCurrentItem(item);
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
