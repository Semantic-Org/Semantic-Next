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

const createInstance = ({tpl, settings, $, state, flush, afterFlush, dispatchEvent}) => ({
  initialize() {
    tpl.setMenusFromURL(settings.activeURL);
  },
  setMenusFromURL(activeURL) {
    const result = tpl.getMenuMatchingURL(settings.menu, activeURL);
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
    const searchMenu = ({header, menu}, depth, parentMenu) => {
      each(menu, (item) => {
        // for topbar menu we dont want to count it a match if url is matched
        if(depth > 0 && item.url && (tpl.isSameURL(item.url, url))) {
          result = {
            menu: { header, menu },
            depth,
            parentMenu,
          };
          return false;
        }
        if (item.pages) {
          each(item.pages, (page) => {
            if(page.url && (tpl.isSameURL(page.url, url))) {
              result = {
                menu: { header, menu },
                depth,
                parentMenu,
              };
              return false;
            }
          });
        }
        if (item.menu && !result.menu) {
          searchMenu({ header: item.name, menu: item.menu}, depth + 1, { header, menu });
        }
      });
    };
    // top level has no header
    searchMenu({header: undefined, menu }, 0);
    // always return top level if no result
    if(!result.menu ) {
      result.menu = menu;
    }
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
  show(callback = noop) {
    tpl.getDialog().showModal();
    dispatchEvent('show');
    tpl.setMenuHeight('active');
    callback();
  },
  hide(callback = noop) {
    tpl.getDialog().close();
    dispatchEvent('hide');
    callback();
    tpl.resetMenu();
  },
  showPreviousMenu() {
    tpl.setMenuHeight('previous');
    $('.container')
      .addClass('animate left')
      .one('transitionend', () => {
        requestAnimationFrame(tpl.moveToPreviousMenu);
      })
    ;
  },
  setMenuHeight(name) {
    const height = $('.container .content')
      .filter(`.${name}`)
      .height()
    ;
    $('.container').css({height: `${height}px`});
  },
  showNextMenu() {
    $('.container').addClass('animate left');
  },
  resetAnimation() {
    $('.container').removeClass('animate left right');
  },
  resetMenu() {
    tpl.setMenusFromURL(settings.activeURL);
  },
  moveToPreviousMenu() {
    const previousMenu = state.previousMenu.value;
    const depth = state.depth.get() - 1;
    // if we are at top level we know no previous menu
    if(depth == 0) {
      state.activeMenu.set(state.previousMenu.get());
      state.previousMenu.set({});
    }
    else {
      // otherwise just use the first menu item url to get the menu
      const activeURL = previousMenu.menu[0].url;
      tpl.setMenusFromURL(activeURL);
    }
    afterFlush(tpl.resetAnimation);
    flush();
  }
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
