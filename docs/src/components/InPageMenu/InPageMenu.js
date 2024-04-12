import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { each } from '@semantic-ui/utils';

import template from './InPageMenu.html?raw';
import css from './InPageMenu.css?raw';
import { ReactiveVar } from '@semantic-ui/reactivity';

const settings = {
  menu: [],
  scrollContext: null,
  intersectionContext: null,
  intersectionOffset: 0,
  scrollOffset: 0,
};

const createInstance = ({tpl, isServer, settings, $}) => ({
  openIndex: new ReactiveVar(0),
  currentItem: new ReactiveVar(0),

  getAnchorID(item) {
    return item?._id || item.title.toLowercase();
  },
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
  observeSections() {
    const root = $(settings.intersectionContext, document).get(0);
    const observerSettings = {
      root: root,
      threshold: 0,
      rootMargin: `-${settings.intersectionOffset}px 0px 0px 0px`
      //rootMargin: `0px 0px 0px 0px`
    };
    tpl.observer = new IntersectionObserver(tpl.onIntersection, observerSettings);
    each(settings.menu, (section) => {
      each(section.items, (item) => {
        const itemID = tpl.getAnchorID(item);
        const sectionElement = document.getElementById(itemID);
        if (sectionElement) {
          tpl.observer.observe(sectionElement);
        }
      });
    });
    return tpl.observer;
  },
  onIntersection(entries) {
    let closestSection = null;
    let minDistance = Infinity;
    let lastTarget = null;
    entries.forEach(entry => {
      const distanceFromTop = entry.boundingClientRect.bottom;
      const isScrollingDown = entry.rootBounds.top > 0;

      if (isScrollingDown && distanceFromTop > 0 && distanceFromTop < minDistance) {
        minDistance = distanceFromTop;
        if(!closestSection) {
          closestSection = entry.target;
        }
      } else if (!isScrollingDown && entry.isIntersecting) {
        if(!closestSection) {
          closestSection = lastTarget;
        }
      }
      lastTarget = entry.target;
    });
    if(closestSection) {
      const itemID = closestSection.id;
      tpl.setActiveItem(itemID);
    }
  },
  setActiveItem(itemID) {
    const menu = settings.menu; // shorthand
    const menuItem = menu.find((item) =>
      item.items.some((subItem) => tpl.getAnchorID(subItem) === itemID)
    );
    if (menuItem) {
      const menuIndex = menu.indexOf(menuItem);
      tpl.openIndex.set(menuIndex);
      tpl.currentItem.set(itemID);
    }
  },
  bindIntersectionObserver() {
    tpl.observeSections();
  },
  isCurrentItem(item) {
    const itemID = tpl.getAnchorID(item);
    return tpl.currentItem.get() === itemID;
  },
  maybeCurrentItem(item) {
    return tpl.isCurrentItem(item) ? 'current' : '';
  },
  scrollTo(itemID, offset = Number(settings.scrollOffset)) {
    const element = document.getElementById(itemID);
    if (element) {
      const targetPosition = element.offsetTop + offset;
      const scrollContext = (settings.scrollContext)
        ? $(settings.scrollContext, document).get(0)
        : window
      ;
      console.log(element.offsetTop, targetPosition);
      if(scrollContext) {
        scrollContext.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
});

const onRendered = function ({ tpl, isServer, settings}) {
  if(isServer) {
    return;
  }
  console.log(settings);
  tpl.calculateScrollHeight();
  tpl.bindIntersectionObserver();
};

const onDestroyed = function ({ tpl }) {
  if (tpl.observer) {
    tpl.observer.disconnect();
  }
};

const events = {
  'click .title'({event, tpl, data}) {
    const currentIndex = tpl.openIndex.get();
    const thisIndex = Number(data.index);
    const newIndex = (currentIndex !== thisIndex) ? thisIndex : -1;
    tpl.openIndex.set(newIndex);
  },
  'click .item'({event, tpl, data}) {
    tpl.scrollTo(data.id);
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
