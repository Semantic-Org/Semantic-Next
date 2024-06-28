import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { any, each, flatten, noop, first, inArray, last, isServer } from '@semantic-ui/utils';

import template from './InPageMenu.html?raw';
import css from './InPageMenu.css?raw';
import { Reaction } from '@semantic-ui/reactivity';

const settings = {
  showHeader: true,
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

const createInstance = ({tpl, state, isServer, reactiveVar, reaction, el, dispatchEvent, settings, attachEvent, $}) => ({

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
    const $content = tpl.getContent();
    return $content.get(0).scrollHeight;
  },

  getContentStyle(index) {
    if(isServer) {
      return;
    }
    if(tpl.isOpenIndex(index)) {
      const $content = tpl.getContent();
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
      const parentItem = { title: section?.title, _id: section?.id };
      return (section?.items)
        ? [parentItem, ...section.items]
        : [parentItem]
      ;
    });
    const flattenedMenu = flatten(menuArrays);
    return flattenedMenu;
  },

  setFirstItemActive() {
    const menu = tpl.getFlattenedMenu();
    const itemID = first(menu)?.id;
    tpl.setActiveItem(itemID);
  },

  setLastItemActive() {
    const menu = tpl.getFlattenedMenu();
    const itemID = last(menu)?.id;
    tpl.setActiveItem(itemID);
  },

  setActiveItem(itemID) {
    tpl.isActivating = true;
    const menu = settings.menu; // shorthand
    const menuItem = menu.find((item) =>
      item?.items && item.items.some((subItem) => settings.getAnchorID(subItem) === itemID)
    );
    if (menuItem) {
      const menuIndex = menu.indexOf(menuItem);
      state.openIndex.set(menuIndex);
      state.currentItem.set(itemID);
      Reaction.afterFlush(() => {
        tpl.isActivating = false;
      });
    }
  },

  hasVisibleItems(section) {
    return any(section?.items || [], (item) => tpl.isVisibleItem(item));
  },

  getContentClasses(index) {
    return {
      active: !settings.useAccordion || tpl.isOpenIndex(index)
    };
  },

  getTitleClasses(section, index) {
    return {
      current: tpl.isOpenIndex(index),
      visible: tpl.hasVisibleItems(section)
    };
  },

  getItemClasses(item) {
    return {
      current: tpl.isCurrentItem(item),
      visible: tpl.isVisibleItem(item),
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
      tpl.scrollToPosition(targetPosition, {
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
    const scrollContext = tpl.getScrollContext();
    tpl.isScrolling = true;

    // special callback if we are at bottom this can be used to make it clear
    // what we are scrolling to (as it may not be the top of the page)
    if(position + scrollContext.clientHeight >= scrollContext.scrollHeight) {
      onSamePage();
    }

    // we want to ignore intersection observer while smoothscroll is happening
    $(scrollContext).one('scrollend', (event) => {
      requestIdleCallback(() => {
        tpl.isScrolling = false;
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
    tpl.observer = new IntersectionObserver(tpl.onIntersection, observerSettings);
    // observe intersection of each id in menu items
    each(settings.menu, (section) => {
      each(section?.items, (item) => {
        const itemID = settings.getAnchorID(item);
        const sectionElement = settings.getElement(itemID);
        if (sectionElement) {
          tpl.observer.observe(sectionElement);
        }
      });
    });
    return tpl.observer;
  },

  onIntersection(entries) {

    let activeEntry;
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

    if(!state.currentItem.get()) {
      activeEntry = entries[0];
    }
    else {
      let eligibleEntries = entries.filter(entry => entry.boundingClientRect.top < 100);
      activeEntry = (tpl.scrollingDown)
        ? last(eligibleEntries)
        : first(eligibleEntries)
      ;

      activeEntry = activeEntry || eligibleEntries[0];
    }

    if(!tpl.isScrolling && activeEntry) {
      const itemID = settings.getActiveElementID(activeEntry.target);
      if(itemID) {
        tpl.setActiveItem(itemID);
      }
    }
  },

  bindHashChange() {
    const scrollToHash = (event) => {
      const itemID = location.hash.substr(1);
      if(itemID) {
        tpl.setActiveItem(itemID);
        tpl.scrollToItem(itemID);
      }
      else {
        tpl.setFirstItemActive();
      }
    };
    attachEvent(window, 'hashchange', (event) => {
      scrollToHash();
      event.preventDefault();
    });
    scrollToHash();
  },

  bindScroll() {
    attachEvent(tpl.getScrollContext(), 'scroll', function() {
      tpl.scrollingDown = Boolean(this.scrollTop > tpl.lastScrollPosition);
      tpl.lastScrollPosition = this.scrollTop;
    }, { passive: true });
  },

  bindPageEvents() {
    tpl.bindScroll();
    tpl.bindHashChange();
    tpl.bindIntersectionObserver();
  },

  unbindPageEvents() {
    if (tpl.observer) {
      tpl.observer.disconnect();
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


const onRendered = function ({ tpl, isServer, settings}) {
  if(isServer || !settings.menu.length) {
    return;
  }
  tpl.bindPageEvents();
  tpl.calculateScrollHeight();
};

const onDestroyed = function ({ tpl, isServer }) {
  if(isServer) {
    return;
  }
  tpl.unbindPageEvents();
};

const events = {
  'click .title'({event, state, data}) {
    const currentIndex = state.openIndex.get();
    const thisIndex = Number(data.index);
    const newIndex = (currentIndex !== thisIndex) ? thisIndex : -1;
    state.openIndex.set(newIndex);
  },
  'click [data-id]'({event, tpl, data}) {
    // this avoids triggering scroll behavior or hashchange
    tpl.setHash(data.id);
    tpl.scrollToItem(data.id);
    event.preventDefault();
  }
};

const InPageMenu = createComponent({
  tagName: 'inpage-menu',
  template,
  css,
  createInstance,
  settings,
  state,
  onRendered,
  onDestroyed,
  events,
});

export default InPageMenu;
export { InPageMenu };
