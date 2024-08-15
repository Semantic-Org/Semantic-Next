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
    console.log(result.menu);
    state.depth.set(result.depth);
    state.activeMenu.set(result.menu);
    state.previousMenu.set(result.parentMenu);
  },
  getMenuMatchingURL(menu, url) {
    let result = {
      menu: null,
      parentMenu: null,
      depth: 0
    };
    const searchMenu = (menu, depth, parentMenu) => {
      each(menu, (item) => {
        // for topbar menu we dont want to count it a match if url is matched
        if(depth > 0 && item.url && (tpl.isSameURL(item.url, url))) {
          result = {
            menu,
            depth,
            parentMenu,
          };
          return false;
        }
        if (item.pages) {
          each(item.pages, (page) => {
            if(page.url && (tpl.isSameURL(page.url, url))) {
              result = {
                menu,
                depth,
                parentMenu,
              };
              return false;
            }
          });
        }
        if (item.menu && !result.menu) {
          searchMenu(item.menu, depth + 1, menu);
        }
      });
    };
    searchMenu(menu, 0);
    // always return top level if no result
    if(!result.menu ) {
      result.menu = menu;
    }
    console.log(result);
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
  },
  showPreviousMenu() {
    $('.container').addClass('animate left');
  },
  showNextMenu() {
    $('.container').addClass('animate left');
  },
});

const events = {
  'click dialog'({event, tpl}) {
    if($(event.target).is('dialog')) {
      tpl.hide();
    }
  },
  'click .return'({ state, tpl }) {
    state.nextMenu.set(state.previousMenu.get());
    tpl.showPreviousMenu();
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
