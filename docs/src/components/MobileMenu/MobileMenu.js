import { UIIcon } from '@semantic-ui/core';
import { createComponent } from '@semantic-ui/component';
import { noop } from '@semantic-ui/utils';
import template from './MobileMenu.html?raw';
import css from './MobileMenu.css?raw';

const settings = {
  menu: [],
  activeURL: '',
};

const state = {
  visibleMenu: [],
  nextMenu: [],
};

const createInstance = ({tpl, settings, $, state, dispatchEvent}) => ({
  getDialog() {
    return $('dialog').el();
  },
  initialize() {
    state.visibleMenu.set(settings.menu);
  },
  show(callback = noop) {
    if(callback() !== false) {
      tpl.getDialog().showModal();
    }
    dispatchEvent('show');
  },
  hide(callback = noop) {
    if(callback() !== false) {
      tpl.getDialog().close();
    }
    dispatchEvent('hide');
  }
});

const events = {
  'click dialog'({event, settings, data, tpl}) {
    if($(event.target).is('dialog')) {
      tpl.hide();
    }
  }
};

const MobileMenu = createComponent({
  tagName: 'mobile-menu',
  template,
  css,
  createInstance,
  settings,
  events,
  state
});

export default MobileMenu;
export { MobileMenu };
