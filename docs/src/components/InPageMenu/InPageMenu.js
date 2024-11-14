import { UIIcon } from '@semantic-ui/core';
import { defineComponent } from '@semantic-ui/component';
import { any, each, flatten, noop, first, inArray, last, isServer } from '@semantic-ui/utils';

import template from './InPageMenu.html?raw';
import css from './InPageMenu.css?raw';
import { Reaction } from '@semantic-ui/reactivity';

const settings = {
  showHeader: false,
  header: 'On This Page',
  menu: [],
  scrollContext: (isServer) ? null : window,
  scrollOffset: 0,
  intersectionContext: null,
  smoothScroll: true,
  useAccordion: true,

  // get page element associated with a menu item
  getElement: (itemID) => document.getElementById(itemID),

  // get page element id from menu item
  getAnchorID: (item) => item?.id,

  // get menu item id from page element
  getActiveElementID: (element) => element?.id
};

const state = {
  openIndex: 0,
  currentItem: null,
  visibleItems: [],
};

const createComponent = ({self, state, isServer, reactiveVar, reaction, el, dispatchEvent, settings, attachEvent, $}) => ({

  observer: null, // intersection observer
  lastScrollPosition: 0, // used to track scroll direction
  isScrolling: false, // to avoid intersection observes when scrolling to item
  isActivating: false, // to avoid scroll events while activating element
  scrollingDown: false, // are we scrolling down

  isOpenIndex(index) {
    return index == state.openIndex.get();
  },

  getContent(index = state.openIndex.get()) {
    return $('.content').eq(index);
  },

  getScrollHeight(index) {
    const $content = self.getContent();
    return $content.get(0).scrollHeight;
  },

  getContentStyle(index) {
    if(isServer) {
      return;
    }
    if(self.isOpenIndex(index)) {
      const $content = self.getContent();
      const scrollHeight = $content.scrollHeight();
      return `max-height: ${scrollHeight}px;`;
    }
  },

  calculateScrollHeight() {
    reaction(() => {
      if(isServer) {
        return;
      }
      state.openIndex.get(); // reactivity source
      $('.active.content').each(function(el) {
        el.style.setProperty('--max-height', `${el.scrollHeight}px`);
      });
    });
  },

  // returns all titles and items as a flat ordered list
  getFlattenedMenu() {
    const menuArrays = settings.menu.map(section => {
      const parentItem = { title: section?.title, id: section?.id };
      return (section?.items)
        ? [parentItem, ...section.items]
        : [parentItem]
      ;
    });
    const flattenedMenu = flatten(menuArrays);
    return flattenedMenu;
  },

  setFirstItemActive() {
    const menu = self.getFlattenedMenu();
    const itemID = first(menu)?.id;
    self.setActiveItem(itemID);
  },

  setLastItemActive() {
    const menu = self.getFlattenedMenu();
    const itemID = last(menu)?.id;
    self.setActiveItem(itemID);
  },

  setActiveItem(itemID) {
    self.isActivating = true;
    const menu = settings.menu; // shorthand
    const menuItem = menu.find((item) =>
      item?.items && item.items.some((subItem) => settings.getAnchorID(subItem) === itemID)
    );
    if (menuItem) {
      const menuIndex = menu.indexOf(menuItem);
      state.openIndex.set(menuIndex);
      state.currentItem.set(itemID);
      Reaction.afterFlush(() => {
        self.isActivating = false;
      });
    }
  },

  hasVisibleItems(section) {
    return any(section?.items || [], (item) => self.isVisibleItem(item));
  },

  getContentClasses(index) {
    return {
      active: !settings.useAccordion || self.isOpenIndex(index)
    };
  },

  getTitleClasses(section, index) {
    return {
      current: self.isOpenIndex(index),
      visible: self.hasVisibleItems(section)
    };
  },

  getItemClasses(item) {
    return {
      current: self.isCurrentItem(item),
      visible: self.isVisibleItem(item),
      item: true
    };
  },

  isCurrentItem(item) {
    const currentItem = state.currentItem.get();
    const itemID = settings.getAnchorID(item);
    return currentItem && currentItem === itemID;
  },

  isVisibleItem(item) {
    const itemID = settings.getAnchorID(item);
    const visibleItems = state.visibleItems.get();
    return inArray(itemID, visibleItems);
  },

  scrollToItem(itemID, offset = Number(settings.scrollOffset)) {
    const element = settings.getElement(itemID);
    if (element) {
      const targetPosition = element.offsetTop + offset;
      state.currentItem.set(itemID);
      self.scrollToPosition(targetPosition, {
        onSamePage() {
          dispatchEvent('samePageActive', { element, itemID });
        }
      });
      dispatchEvent('active', { itemID });
    }
  },

  getScrollContext() {
    return (settings.scrollContext)
      ? $(settings.scrollContext, { root: document }).get(0)
      : window
    ;
  },

  scrollToPosition(position, { onSamePage = noop } = {}) {
    const scrollContext = self.getScrollContext();
    self.isScrolling = true;

    // special callback if we are at bottom this can be used to make it clear
    // what we are scrolling to (as it may not be the top of the page)
    if(position + scrollContext.clientHeight >= scrollContext.scrollHeight) {
      onSamePage();
    }

    // we want to ignore intersection observer while smoothscroll is happening
    $(scrollContext).one('scrollend', (event) => {
      requestIdleCallback(() => {
        self.isScrolling = false;
        dispatchEvent('finishScroll', { position });
      });
    });
    scrollContext.scrollTo({
      top: position,
      behavior: (settings.smoothScroll) ? 'smooth' : 'auto'
    });
  },

  bindIntersectionObserver() {
    const root = $(settings.intersectionContext, document).get(0);
    const observerSettings = {
      root: root,
      threshold: [0, 1],
      rootMargin: `0px 0px 0px 0px`
    };
    self.observer = new IntersectionObserver(self.onIntersection, observerSettings);
    // observe intersection of each id in menu items
    each(settings.menu, (section) => {
      each(section?.items, (item) => {
        const itemID = settings.getAnchorID(item);
        const sectionElement = settings.getElement(itemID);
        if (sectionElement) {
          self.observer.observe(sectionElement);
        }
      });
    });
    return self.observer;
  },

  onIntersection(entries) {

    const currentVisibleItems = state.visibleItems.get();
    let newVisibleItems = [...currentVisibleItems];

    entries.forEach(entry => {
      const itemID = settings.getActiveElementID(entry.target);
      if(itemID) {
        if(entry.isIntersecting && !newVisibleItems.includes(itemID)) {
          newVisibleItems.push(itemID);
        }
        else if(!entry.isIntersecting) {
          newVisibleItems = newVisibleItems.filter(id => id !== itemID);
        }
      }
    });

    state.visibleItems.set(newVisibleItems);

    if(!self.isScrolling && newVisibleItems.length) {
      const visibleItems = self.getFlattenedMenu().map(item => item.id).filter(item => inArray(item, newVisibleItems));
      self.setActiveItem(visibleItems[0]);
    }
  },

  bindHashChange() {
    const scrollToHash = (event) => {
      const itemID = location.hash.substr(1);
      if(itemID) {
        self.setActiveItem(itemID);
        self.scrollToItem(itemID);
      }
      else {
        self.setFirstItemActive();
      }
    };
    attachEvent(window, 'hashchange', (event) => {
      scrollToHash();
      event.preventDefault();
    });
    scrollToHash();
  },

  bindScroll() {
    attachEvent(self.getScrollContext(), 'scroll', function() {
      self.scrollingDown = Boolean(this.scrollTop > self.lastScrollPosition);
      self.lastScrollPosition = this.scrollTop;
    }, { passive: true });
  },

  bindPageEvents() {
    self.bindScroll();
    self.bindHashChange();
    self.bindIntersectionObserver();
  },

  unbindPageEvents() {
    if (self.observer) {
      self.observer.disconnect();
    }
  },

  setHash(itemID) {
    // this avoids triggering default scrolling behavior by using pushState
    const hash = `#${itemID}`;
    if(window.location.hash !== hash) {
      history.pushState(null, '', hash);
    }
  }

});


const onRendered = function ({ self, isServer, settings}) {
  if(isServer || !settings.menu.length) {
    return;
  }
  self.bindPageEvents();
  self.calculateScrollHeight();
};

const onDestroyed = function ({ self, isServer }) {
  if(isServer) {
    return;
  }
  self.unbindPageEvents();
};

const events = {
  'click .title'({event, state, data}) {
    const currentIndex = state.openIndex.get();
    const thisIndex = Number(data.index);
    const newIndex = (currentIndex !== thisIndex) ? thisIndex : -1;
    state.openIndex.set(newIndex);
  },
  'click [data-id]'({event, self, data}) {
    // this avoids triggering scroll behavior or hashchange
    self.setHash(data.id);
    self.scrollToItem(data.id);
    event.preventDefault();
  }
};

const InPageMenu = defineComponent({
  tagName: 'inpage-menu',
  template,
  css,
  createComponent,
  settings,
  state,
  onRendered,
  onDestroyed,
  events,
});

export default InPageMenu;
export { InPageMenu };
