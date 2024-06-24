import { createComponent } from '@semantic-ui/component';
import { MenuItemComponentSpec } from '@semantic-ui/specs';

import MenuItemCSS from './menu-item.css?raw';
import MenuItemTemplate from './menu-item.html?raw';

const createInstance = ({settings, tpl, findParent, dispatchEvent}) => ({

  calculateActive() {
    //settings.active = true;
  },

  getValue() {
    return settings.value || settings.href;
  },

  getMenuValue() {
    let menu = findParent('uiMenu');
    if(menu) {
      return menu.getValue();
    }
  },

  setMenuValue(value) {
    let menu = findParent('uiMenu');
    if(menu) {
      menu.setValue(settings.value);
    }
  },

  isActive(activeValue) {
    const menuValue = tpl.getMenuValue();
    if(settings.active) {
      return true;
    }
    if(menuValue !== undefined) {
      return menuValue == settings.value;
    }
    return false;
  }
});


const onCreated = ({tpl}) => {
  tpl.calculateActive();
};

const events = {
  'click .item'({tpl, settings}) {
    tpl.setMenuValue(settings.value);
  },
  'touchstart .item'() {
    $(this).addClass('pressed');
  },
  'touchend .item'() {
    $(this).removeClass('pressed');
  },
};

export const MenuItem = createComponent({
  tagName: 'menu-item',
  events: events,
  onCreated,
  createInstance,
  componentSpec: MenuItemComponentSpec,
  template: MenuItemTemplate,
  css: MenuItemCSS,
});
