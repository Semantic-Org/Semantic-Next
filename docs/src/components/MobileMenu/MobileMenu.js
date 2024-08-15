import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { noop, each } from '@semantic-ui/utils';
import template from './MobileMenu.html?raw';
import css from './MobileMenu.css?raw';

const settings = {
  menu: [],
  activeURL: '',
};

const state = {
  depth: 0,
  activeMenu: [],
  previousMenu: [],
  nextMenu: [],
};

const createInstance = ({tpl, settings, $, state, dispatchEvent}) => ({
  initialize() {
    const result = tpl.getMenuMatchingURL(settings.menu, settings.activeURL);
    state.depth.set(result.depth);
    state.activeMenu.set(result.menu);
    state.previousMenu.set(result.parentMenu);
  },
  getMenuMatchingURL(menu, url) {
    let result = {
      menu: null,
      parentMenu: null,
      depth: -1
    };
    const searchMenu = (menu, depth, parentMenu) => {
      each(menu, (item) => {
        if(item.url && (tpl.isSameURL(item.url, url))) {
          result = {
            menu,
            depth,
            parentMenu,
          };
        }
        if (item.pages) {
          each(item.pages, (page) => {
            if(page.url && (tpl.isSameURL(page.url, url))) {
              result = {
                menu,
                depth,
                parentMenu,
              };
              return;
            }
          });
        }
        if (!result.menu && item.menu) {
          searchMenu(item.pages, depth + 1, menu);
        }
      });
    };
    searchMenu(menu, 0);
    return result;
  },
  addTrailingSlash(url) {
    return (url.substr(-1) === '/')
      ? url
      : `${url}/`
    ;
  },
  isSameURL(url1 = '', url2 = '') {
    if(!url1 || !url2) {
      return false;
    }
    return tpl.addTrailingSlash(url1) == tpl.addTrailingSlash(url2);
  },

  getDialog() {
    return $('dialog').el();
  },
  getActiveMenu() {
    // find active item
    // if none top level
  },
  show(callback = noop) {
    tpl.getDialog().showModal();
    dispatchEvent('show');
  },
  hide(callback = noop) {
    tpl.getDialog().close();
    dispatchEvent('hide');
  }
});

const events = {
  'click dialog'({event, settings, data, tpl}) {
    if($(event.target).is('dialog')) {
      tpl.hide();
    }
  }
};

const MobileMenu = createComponent({
  tagName: 'mobile-menu',
  template,
  css,
  createInstance,
  settings,
  events,
  state
});

export default MobileMenu;
export { MobileMenu };
