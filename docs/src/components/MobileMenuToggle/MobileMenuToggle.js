import { defineComponent } from '@semantic-ui/component';
import { UIIcon } from '@semantic-ui/core';
import css from './MobileMenuToggle.css?raw';
import template from './MobileMenuToggle.html?raw';

const createComponent = function({ $, isServer, attachEvent, tpl }) {
  return {
    getMenu() {
      return $('mobile-menu', { root: document }).component();
    },
    isVisible() {
      const menu = tpl.getMenu();
    },
    showMenu() {
      const menu = tpl.getMenu();
      if (menu) {
        menu.show();
      }
    },
    hideMenu() {
      const menu = tpl.getMenu();
      if (menu) {
        menu.hide();
      }
    },
  };
};

const events = {
  'click .hitbox'({ tpl }) {
    if (tpl.isVisible()) {
      tpl.hideMenu();
    }
    else {
      tpl.showMenu();
    }
  },
};

const MobileMenuToggle = defineComponent({
  tagName: 'mobile-menu-toggle',
  template,
  events,
  css,
  createComponent,
});

export default MobileMenuToggle;
export { MobileMenuToggle };
