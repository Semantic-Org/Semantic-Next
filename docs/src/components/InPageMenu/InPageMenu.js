import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { each, first, last } from '@semantic-ui/utils';

import template from './InPageMenu.html?raw';
import css from './InPageMenu.css?raw';
import { ReactiveVar } from '@semantic-ui/reactivity';

const settings = {
  menu: [],
  scrollContext: null,
  intersectionContext: null,
  intersectionOffset: 0,
  smoothScroll: true,
  scrollOffset: 0,
  useAccordion: true,
  getAnchorID: (item) => item?._id,
  getElement: (itemID) => document.getElementById(itemID),
  onActive: (itemID) => itemID,
  getActiveElementID: (element) => element?.id
};

const createInstance = ({tpl, isServer, settings, $}) => ({
  openIndex: new ReactiveVar(0),
  currentItem: new ReactiveVar(0),

  observer: null, // intersection observer
  lastScrollPosition: 0, // used to track scroll direction

  isOpenIndex(index) {
    return index == tpl.openIndex.get();
  },

  maybeActiveTitle(index) {
    return (tpl.isOpenIndex(index))
      ? 'active'
      : ''
    ;
  },

  maybeActiveContent(index) {
    return (!settings.useAccordion || tpl.isOpenIndex(index))
      ? 'active'
      : ''
    ;
  },

  getContent(index = tpl.openIndex.get()) {
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
    tpl.reaction(() => {
      if(isServer) {
        return;
      }
      tpl.openIndex.get(); // reactivity source
      $('.active.content').each(function(el) {
        el.style.setProperty('--max-height', `${el.scrollHeight}px`);
      });
    });
  },

  getAllFlattenedLinks() {

  },

  setFirstItemActive() {
    const itemID = settings.getAnchorID(settings.menu[0].items[0]);
    tpl.setActiveItem(itemID);
    tpl.scrollToPosition(0);
  },

  setActiveItem(itemID) {
    const menu = settings.menu; // shorthand
    const menuItem = menu.find((item) =>
      item.items.some((subItem) => settings.getAnchorID(subItem) === itemID)
    );
    if (menuItem) {
      const menuIndex = menu.indexOf(menuItem);
      tpl.openIndex.set(menuIndex);
      tpl.currentItem.set(itemID);
    }
  },

  isCurrentItem(item) {
    const itemID = settings.getAnchorID(item);
    return tpl.currentItem.get() === itemID;
  },

  maybeCurrentItem(item) {
    return tpl.isCurrentItem(item) ? 'current' : '';
  },

  scrollToItem(itemID, offset = Number(settings.scrollOffset)) {
    const element = settings.getElement(itemID);
    if (element) {
      const targetPosition = element.offsetTop + offset;
      tpl.currentItem.set(itemID);
      tpl.scrollToPosition(targetPosition);
      settings.onActive(itemID);
    }
  },

  scrollToPosition(position) {
    const scrollContext = (settings.scrollContext)
      ? $(settings.scrollContext, document).get(0)
      : window
    ;
    tpl.isScrolling = true;
    // we want to ignore intersection observer while smoothscroll is happening
    $(scrollContext).one('scrollend', (event) => {
      requestIdleCallback(() => {
        tpl.isScrolling = false;
      });
    });
    scrollContext.scrollTo({
      top: position,
      behavior: 'smooth'
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
      each(section.items, (item) => {
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
    // intersection occurred while scrolling
    if(tpl.isScrolling) {
      return;
    }

    let activeEntry;

    // on first load we want to return the top most element
    if(!tpl.currentItem.get()) {
      activeEntry = entries[0];
    }
    else {
      let eligibleEntries = entries.filter(entry => entry.boundingClientRect.top < 100);
      // intersection triggers both when the element LEAVES the top (which we want)
      // and appears at the bottom of the page
      // we want to filter out all intersection events which are reaching the bottom of the page;

      // this event is debounced so it may return multiple visible entries
      // we want to get the first one that is fully visible
      activeEntry = (tpl.scrollingDown)
        ? last(eligibleEntries)
        : first(eligibleEntries)
      ;

      // if the scroll bar is at bottom we always highlight the bottom menu item
      if(tpl.scrolledBottom) {
        activeEntry = last(entries);
      }

      // in the case that we are scrolling up (threshhold 1) we want to return the first
      activeEntry = activeEntry || eligibleEntries[0];
    }

    if(activeEntry) {
      const itemID = settings.getActiveElementID(activeEntry.target);
      if(itemID) {
        tpl.setActiveItem(itemID);
      }
    }
  },

  bindHashChange() {
    tpl.hashChange = $(window).on('hashchange', (event) => {
      const itemID = location.hash.substr(1);
      if(itemID) {
        tpl.setActiveItem(itemID);
        tpl.scrollToItem(itemID);
      }
      else {
        tpl.setFirstItemActive();
      }
      event.preventDefault();
    });
  },

  bindScroll() {
    tpl.scrollEvent = $(settings.scrollContext, document)
      .on('scroll', function () {
        tpl.scrollingDown = Boolean(this.scrollTop > tpl.lastScrollPosition);
        tpl.scrolledBottom = this.scrollTop + this.clientHeight == this.scrollHeight;
        tpl.lastScrollPosition = this.scrollTop;
        if(tpl.scrolledBottom) {
          requestAnimationFrame(() => {
            console.log('select bottom');
          })
        }
      }, { passive: true })
    ;
  },

  bindPageEvents() {
    tpl.bindScroll();
    tpl.bindHashChange();
    tpl.bindIntersectionObserver();
  },

  unbindEvents() {
    if (tpl.observer) {
      tpl.observer.disconnect();
    }
    if (tpl.hashChange) {
      $(window).off(tpl.hashChange);
    }
    if (tpl.scrollEvent) {
      $(settings.scrollContext).off(tpl.scrollEvent);
    }
  }
});

const onRendered = function ({ tpl, isServer, settings}) {
  if(isServer) {
    return;
  }
  tpl.calculateScrollHeight();
  tpl.bindPageEvents();
};

const onDestroyed = function ({ tpl, isServer }) {
  if(isServer) {
    return;
  }
  tpl.unbindPageEvents();
};

const events = {
  'click .title'({event, tpl, data}) {
    const currentIndex = tpl.openIndex.get();
    const thisIndex = Number(data.index);
    const newIndex = (currentIndex !== thisIndex) ? thisIndex : -1;
    tpl.openIndex.set(newIndex);
  },
  'click .item'({event, tpl, data}) {
    location.hash = `#${data.id}`;
    event.preventDefault();
  }
};

const InPageMenu = createComponent({
  tagName: 'inpage-menu',
  template,
  css,
  createInstance,
  settings,
  onRendered,
  onDestroyed,
  events,
});

export default InPageMenu;
export { InPageMenu };
