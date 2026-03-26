import { defineComponent } from '@semantic-ui/component';
import { Icon } from '../../primitives/index.js';
import css from './mobile-menu-toggle.css?raw';
import template from './mobile-menu-toggle.html?raw';

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
