import NavMenu from '@components/NavMenu/NavMenu.js';
import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { noop, each } from '@semantic-ui/utils';
import template from './MobileMenu.html?raw';
import css from './MobileMenu.css?raw';

const settings = {
  menu: [],
  activeURL: '',
  navIcon: 'right-chevron'
};

const state = {
  depth: 0,
  activeMenu: {},
  previousMenu: {},
  nextMenu: {},
};

const createInstance = ({tpl, settings, $, state, flush, afterFlush, dispatchEvent}) => ({

  initialize() {
    tpl.setMenusFromURL(settings.activeURL);
  },

  setMenusFromURL(activeURL) {
    const result = tpl.getMenuMatchingURL(settings.menu, activeURL);
    console.log(result.menu);
    console.log(result.parentMenu);
    state.depth.set(result.depth);
    state.activeMenu.set(tpl.addNavIcons(result.menu));
    state.previousMenu.set(tpl.addNavIcons(result.parentMenu));
  },

  // looks at current active url and determines where in menu heirarchy the current menu is
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
      result.menu = { header: undefined, menu };
    }
    result.parentMenu = tpl.addNavIcons(result.parentMenu);
    result.menu = tpl.addNavIcons(result.menu);
    return result;
  },

  // add -> icon if the menu has a sub menu
  addNavIcons(menu) {
    if(!settings.navIcon) {
      return menu;
    }
    (menu?.menu || []).map(item => {
      if(item.menu) {
        item.navIcon = settings.navIcon;
      }
      return item;
    });
    return menu;
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
      .find('.previous.content').one('transitionend', () => {
        requestAnimationFrame(tpl.moveToPreviousMenu);
      })
    ;
  },

  // use the menu index to find the next menu
  setNextMenu(index) {
    const activeMenu = state.activeMenu.get();
    const activeItem = activeMenu?.menu[index];
    const menu = {
      header: activeItem.name,
      menu: tpl.addNavIcons(activeItem.menu)
    };
    state.previousMenu.set(state.activeMenu.get());
    state.nextMenu.set(menu);
  },

  showNextMenu() {
    tpl.setMenuHeight('next');
    $('.container')
      .addClass('animate right')
      .find('.next.content').one('transitionend', () => {
        requestAnimationFrame(tpl.moveToNextMenu);
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
      state.activeMenu.set(previousMenu);
      state.previousMenu.set({});
    }
    else {
      // otherwise just use the first menu item url to get the menu
      const activeURL = previousMenu.menu[0].url;
      tpl.setMenusFromURL(activeURL);
    }
    state.nextMenu.set({});
    state.depth.set(depth);
    afterFlush(tpl.resetAnimation);
    flush();
  },
  moveToNextMenu() {
    const depth = state.depth.get() + 1;
    state.previousMenu.set(state.activeMenu.get());
    state.activeMenu.set(state.nextMenu.get());
    state.depth.set(depth);
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
    tpl.showPreviousMenu();
  },
  'click .nav-icon'({tpl, target, state, event, $, afterFlush}) {
    const $title = $(target).closest('.title');
    const index = $title.index('.title');

    // set the next menu from the index
    tpl.setNextMenu(index);

    // wait for web component to update before animating
    $('.next.content nav-menu').one('updated', tpl.showNextMenu);

    event.stopImmediatePropagation();
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
