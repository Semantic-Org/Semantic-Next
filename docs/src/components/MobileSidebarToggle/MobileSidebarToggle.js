import { UIIcon } from '@semantic-ui/core';

import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import template from './MobileSidebarToggle.html?raw';
import css from './MobileSidebarToggle.css?raw';

const createInstance = function ({ $, isServer, tpl }) {
  return {
    getSidebar() {
      return $('sidebar', document);
    },
    isVisible() {
      const $sidebar = tpl.getSidebar();
      if(tpl.canUsePopover()) {
        return $sidebar.filter(':popover-open').length;
      }
      return $sidebar.hasClass('visible');
    },
    showSidebar() {
      const $sidebar = tpl.getSidebar();
      if(tpl.canUsePopover()) {
        $sidebar.get(0).showPopover();
      }
      else {
        $sidebar.addClass('visible');
      }
    },
    hideSidebar() {
      const $sidebar = tpl.getSidebar();
      if(tpl.canUsePopover()) {
        $sidebar.get(0).hidePopover();
      }
      else {
        $sidebar.removeClass('visible');
      }
    },
    canUsePopover() {
      const $sidebar = tpl.getSidebar();
      return !!$sidebar.get(0).showPopover;
    },
    bindClickaway() {
      //tpl.clickaway = $('body').on('click',
    }
  };
};

const onCreated = function({tpl, isClient}) {
};

const onDestroyed = function({tpl, isClient}) {
};


const events = {
  'click ui-icon'({tpl}) {
    if(tpl.isVisible()) {
      tpl.hideSidebar();
    }
    else {
      tpl.showSidebar();
    }
  },
};

const MobileSidebarToggle = createComponent({
  tagName: 'mobile-sidebar-toggle',
  template,
  events,
  css,
  onCreated,
  createInstance,
});

export default MobileSidebarToggle;
export { MobileSidebarToggle };
