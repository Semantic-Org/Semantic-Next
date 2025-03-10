import { UIIcon } from '@semantic-ui/core';
import { defineComponent } from '@semantic-ui/component';
import { noop, each } from '@semantic-ui/utils';
import template from './MobileMenu.html?raw';
import css from './MobileMenu.css?raw';


import { NavMenu } from '../NavMenu/NavMenu.js';

const defaultSettings = {
  menu: [],
  activeURL: '',
  stickyHeaders: true,
  navIcon: 'right-chevron'
};

const defaultState = {
  depth: 0,
  activeMenu: {},
  previousMenu: {},
  nextMenu: {},
};

const createComponent = ({tpl, settings, $, state, flush, afterFlush, dispatchEvent}) => ({

  initialize() {
    tpl.setMenusFromURL(settings.activeURL);
  },

  getClasses() {
    return {
      sticky: settings.stickyHeaders
    };
  },

  setMenusFromURL(activeURL) {
    const result = tpl.getMenuMatchingURL(settings.menu, activeURL);
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
        if(depth > 0 && tpl.isSameURL(item.url, url)) {
          result = {
            menu: { header, menu },
            depth,
            parentMenu,
          };
          return false;
        }
        // we stack exactly 2 levels in each mobile menu level
        // hence repetitive logic here
        if (item.pages) {
          each(item.pages, (page) => {
            if(tpl.isSameURL(page.url, url)) {
              result = {
                menu: { header, menu },
                depth,
                parentMenu,
              };
            }
            else if(page.pages) {
              each(page.pages, (subPage) => {
                if(tpl.isSameURL(subPage.url, url)) {
                  result = {
                    menu: { header, menu },
                    depth,
                    parentMenu,
                  };
                }
              });
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

  scrollIntoView() {
    const $activeContent = $('.active.content');
    const $current = $$('.active.content nav-menu .current.item');
    const el = $current.first().el();
    if(el) {
      const rect = el.getBoundingClientRect();
      console.log(rect);
    }
  },

  show(callback = noop) {
    tpl.getDialog().showModal();
    dispatchEvent('show');
    tpl.setMenuHeight('active');
    tpl.scrollIntoView();
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
    $('.active.content nav-menu').scrollTop(0);
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
    else if(previousMenu.length) {
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
  'pointerdown .return'({ state, tpl }) {
    tpl.showPreviousMenu();
  },
  'deep pointerdown .nav-icon'({tpl, target, state, event, $, afterFlush}) {
    const $title = $(target).closest('.title');
    const index = $title.index('.title');

    // set the next menu from the index
    tpl.setNextMenu(index);

    // wait for web component to update before animating
    $('.next.content nav-menu').one('updated', tpl.showNextMenu);
  },
  'deep click .nav-icon'({tpl, target, state, event, $, afterFlush}) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
};

const MobileMenu = defineComponent({
  tagName: 'mobile-menu',
  template,
  css,
  createComponent,
  defaultSettings,
  events,
  defaultState
});

export default MobileMenu;
export { MobileMenu };
