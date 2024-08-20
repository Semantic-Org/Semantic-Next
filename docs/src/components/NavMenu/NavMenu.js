import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { any, isFunction, isArray } from '@semantic-ui/utils';
import template from './NavMenu.html?raw';
import css from './NavMenu.css?raw';

const settings = {
  menu: [],
  linkCurrentPage: false,
  expandAll: false,
  useAccordion: false,
  navIcon: '',
  activeURL: '',
};

const state = {
  url: ''
};

const createInstance = function ({ tpl, data, state, settings }) {
  return {
    initialize() {
      state.url.set(settings.activeURL);
    },
    getMenu() {
      return tpl.filterVisibleSections(settings.menu);
    },
    getNavIcon(section) {
      const defaultIcon = (settings.useAccordion && section?.pages)
        ? 'chevron-down'
        : ''
      ;
      return section?.navIcon || settings.navIcon || defaultIcon;
    },
    getTitleStates(title) {
      const classes = [];
      if (tpl.isExpandable(title)) {
        classes.push('expandable');
      }
      if (tpl.isActiveItem(title)) {
        classes.push('active');
      }
      if (tpl.isCurrentItem(title)) {
        classes.push('current');
      }
      return classes;
    },
    canShowNavIcon(section) {
      return tpl.getNavIcon(section) !== undefined;
    },
    hasIcons() {
      return any(settings.menu, section => section.icon);
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
    isExpandable() {
      return settings.useAccordion && !settings.expandAll;
    },
    isActiveItem(item) {
      if(settings.expandAll) {
        return true;
      }
      if (tpl.isCurrentItem(item)) {
        return true;
      }
      if (isArray(item.pages)) {
        return any(item.pages, tpl.isActiveItem);
      }
      return false;
    },
    addTrailingSlash(url) {
      return (url.substr(-1) === '/')
        ? url
        : `${url}/`
      ;
    },
    isSameURL(url1 = '', url2 = '', startsWith = false) {
      if(startsWith) {
        return url2.startsWith(url1);
      }
      if(!url1 || !url2) {
        return false;
      }
      return tpl.addTrailingSlash(url1) == tpl.addTrailingSlash(url2);
    },
    isCurrentItem(item) {
      return tpl.isSameURL(item?.url, state.url.get(), item.matchSubPaths);
    },
    onPageChange() {
      state.url.set(window.location.pathname);
    }
  };
};

const onCreated =  ({ tpl }) => {
};

const onDestroyed =  ({ tpl }) => {
};

const onRendered =  ({ $, tpl, attachEvent, isClient }) => {
  if(isClient) {
    attachEvent(document, 'astro:after-swap', tpl.onPageChange);
  }
};

const events = {
  'click .title': ({target, event, settings, $, tpl}) => {
    if(!settings.useAccordion) {
      return;
    }
    const $title = $(target);
    const $content = $title.next('.content');
    $title.toggleClass('active');
    $content.toggleClass('active');
  },
  'click .nav-icon'({event}) {
    event.preventDefault();
  }
};

const NavMenu = createComponent({
  tagName: 'nav-menu',
  template,
  css,
  createInstance,
  settings,
  onCreated,
  onDestroyed,
  onRendered,
  events,
  state
});

export default NavMenu;
export { NavMenu };
