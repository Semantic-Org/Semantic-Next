import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
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
      // safari ios doesnt handle this natively properly so we gotta do manual after this event bubbles
      setTimeout(tpl.bindClickaway, 1);
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
      tpl.clickaway = $('body').one('click', function(event) {
        if($(event.target).closest('mobile-sidebar-toggle, sidebar').length == 0) {
          tpl.hideSidebar();
        }
      });
    }
  };
};

const events = {
  'click'({tpl}) {
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
  createInstance,
});

export default MobileSidebarToggle;
export { MobileSidebarToggle };
