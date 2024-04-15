import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { each, firstMatch } from '@semantic-ui/utils';

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
  getAnchorID: (item) => item?._id || item.title.toLowercase(),
  getElement: (itemID) => document.getElementById(itemID),
  onActive: (itemID) => itemID,
  getActiveElementID: (element) => element?.id
};

const createInstance = ({tpl, isServer, settings, $}) => ({
  openIndex: new ReactiveVar(0),
  currentItem: new ReactiveVar(0),

  observer: null, // intersection observer

  isOpenIndex(index) {
    return index == tpl.openIndex.get();
  },

  maybeActive(index) {
    return tpl.isOpenIndex(index)
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

  scrollTo(itemID, offset = Number(settings.scrollOffset)) {
    const element = settings.getElement(itemID);
    if (element) {
      const targetPosition = element.offsetTop + offset;
      const scrollContext = (settings.scrollContext)
        ? $(settings.scrollContext, document).get(0)
        : window
      ;
      if(scrollContext) {
        tpl.isScrolling = true;
        tpl.currentItem.set(itemID);
        // we want to ignore intersection observer while smoothscroll is happening
        $(scrollContext).one('scrollend', (event) => {
          requestIdleCallback(() => {
            tpl.isScrolling = false;
          });
        });
        scrollContext.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        settings.onActive(itemID);
      }
    }
  },

  bindIntersectionObserver() {
    const root = $(settings.intersectionContext, document).get(0);
    const observerSettings = {
      root: root,
      threshold: [0, 1],
      rootMargin: `0px 0px 0px 0px` // dont appear to be working
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
    // this event is debounced so it may return multiple visible entries
    // we want to get the first one that is fully visible
    let activeEntry = firstMatch(entries, entry => entry.intersectionRatio == 1);

    // in the case that we are scrolling up (threshhold 1) we want to return the first
    activeEntry = activeEntry || entries[0];

    const itemID = settings.getActiveElementID(activeEntry.target);
    tpl.setActiveItem(itemID);
  },

  unbindIntersectionObserver() {
    if (tpl.observer) {
      tpl.observer.disconnect();
    }
  },

  bindHashChange() {
    tpl.hashChange = $(window).on('hashchange', (event) => {
      const itemID = location.hash.substr(1);
      tpl.scrollTo(itemID);
      event.preventDefault();
    });
  },

  unbindHashChange() {
    if (tpl.hashChange) {
      $(window).off(tpl.hashChange);
    }
  },
});

const onRendered = function ({ tpl, isServer, settings}) {
  if(isServer) {
    return;
  }
  tpl.calculateScrollHeight();
  tpl.bindHashChange();
  tpl.bindIntersectionObserver();
};

const onDestroyed = function ({ tpl }) {
  tpl.unbindIntersectionObserver();
  tpl.unbindHashChange();
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
