import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { any, isFunction, isArray } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';
import template from './SidebarMenu.html?raw';
import css from './SidebarMenu.css?raw';

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
    getTitleStates(title) {
      const classes = [];
      if (tpl.isActiveItem(title)) {
        classes.push('active');
      }
      if (tpl.isCurrentItem(title)) {
        classes.push('current');
      }
      return classes;
    },
    getPageStates(page) {
      const classes = [];
      if (tpl.isCurrentItem(page)) {
        classes.push('current');
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
    addTrailingSlash(url) {
      return (url.substr(-1) === '/')
        ? url
        : `${url}/`
      ;
    },
    isSameURL(url1, url2) {
      if(!url1 || !url2) {
        return false;
      }
      return tpl.addTrailingSlash(url1) == tpl.addTrailingSlash(url2);
    },
    isCurrentItem(item) {
      return tpl.isSameURL(item?.url, tpl.url.get());
    },
    onPageChange() {
      tpl.url.set(window.location.pathname);
    }
  };
};

const onCreated = function ({ tpl }) {
};

const onDestroyed = function ({ tpl }) {
};

const onRendered = function ({ $, tpl, isClient }) {
  if(isClient) {
    $(document).on('astro:after-swap', tpl.onPageChange);
  }
};

const events = {
};

const SidebarMenu = createComponent({
  tagName: 'sidebar-menu',
  template,
  css,
  createInstance,
  settings,
  onCreated,
  onDestroyed,
  onRendered,
  events,
});

export default SidebarMenu;
export { SidebarMenu };
