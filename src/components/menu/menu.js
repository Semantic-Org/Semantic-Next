import { createComponent } from '@semantic-ui/component';
import { MenuComponentSpec } from '@semantic-ui/specs';

import CSS from './css/menu-shadow.css?raw';
import Template from './menu.html?raw';

const createInstance = ({$$, $, reaction, settings, tpl, dispatchEvent}) => ({

  getValue() {
    return settings.value;
  },

  getItemValue(item) {
    return item.value || item.href;
  },

  isValueActive(activeValue, item) {
    if(item.active) {
      return true;
    }
    if(activeValue !== undefined) {
      return activeValue == tpl.getItemValue(item);
    }
    return false;
  },

  setValue(value) {
    settings.value = value;
    dispatchEvent('change', { value });
    tpl.setActiveItem();
  },

  setActiveItem() {
    const value = settings.value;
    $$('menu-item').each((el) => {
      const menuItem = $(el).getComponent();
      const itemValue = menuItem.getValue();
      if(itemValue == value) {
        $(el).attr('active', true);
      }
      else {
        $(el).removeAttr('active');
      }
    });
  },
});


const onCreated = ({el, settings}) => {
};

const onRendered = function({tpl, settings, isClient}) {
  if(isClient) {
    tpl.setActiveItem();
  }
};

const events = {
  'click menu-item'({tpl, el}) {
    tpl.setValue(el.value);
  }
};

const UIMenu = createComponent({
  tagName: 'ui-menu',
  componentSpec: MenuComponentSpec,
  template: Template,
  css: CSS,
  createInstance,
  events,
  onCreated,
  onRendered,
});

export { UIMenu };
