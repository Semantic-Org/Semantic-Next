import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';

import template from './InPageMenu.html?raw';
import css from './InPageMenu.css?raw';
import { ReactiveVar } from '@semantic-ui/reactivity';

const settings = {
  menu: [],
};

const createInstance = ({tpl, isServer, settings, $}) => ({
  openIndex: new ReactiveVar(0),
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
  }
});

const onRendered = function ({ tpl, settings}) {
  tpl.calculateScrollHeight();
};


const events = {
  'click .title'({event, tpl, data}) {
    const currentIndex = tpl.openIndex.get();
    const thisIndex = Number(data.index);
    const newIndex = (currentIndex !== thisIndex) ? thisIndex : -1;
    tpl.openIndex.set(newIndex);
  }
};

const InPageMenu = createComponent({
  tagName: 'inpage-menu',
  template,
  css,
  createInstance,
  settings,
  onRendered,
  events,
});

export default InPageMenu;
export { InPageMenu };
