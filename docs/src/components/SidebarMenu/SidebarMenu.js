import { createComponent } from '@semantic-ui/component';
import { any, isFunction, isArray, each } from '@semantic-ui/utils';
import template from './SidebarMenu.html?raw';
import css from './SidebarMenu.css?raw';

const settings = {
  menu: [],
  activeURL: '',
};

const createInstance = function ({ tpl, data }) {
  return {
    getMenu() {
      return tpl.filterVisibleSections(data.menu);
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
    isLinkItem(item) {
      return item.url && !tpl.isActiveItem(item);
    },
    isCurrentItem(item) {
      if (tpl.is.activeItem(item)) {
        return true;
      }
      if (isArray(item.pages)) {
        return any(item.pages, tpl.isCurrentItem);
      }
    },
    isActiveItem(item) {
      if (item?.url === data.activeURL) {
        return true;
      }
    },
  };
};

const onCreated = function ({ tpl }) {};

const onDestroyed = function ({ tpl }) {};

const onRendered = function ({ tpl }) {};

const events = {
  // test events
  'click [data-href]'(params) {
    console.log('click data href', this, params);
  },
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

export { SidebarMenu };
