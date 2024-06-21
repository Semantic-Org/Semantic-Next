import { createComponent } from '@semantic-ui/component';
import { MenuComponentSpec } from '@semantic-ui/specs';

import CSS from './css/menu-shadow.css?raw';
import Template from './menu.html?raw';

const createInstance = ({$, reaction, settings, tpl, dispatchEvent}) => ({

  calculateActiveValue() {
    reaction(() => {
      let value = settings.value;
      $('menu-item').each((el) => {
        const menuItem = $(el).getComponent();
        if(menuItem.getValue() == value) {
          $(el).attr('active', true);
        }
        else {
          $(el).removeAttr('active');
        }
      });
    });
  },

  setValue(value) {
    settings.value = value;
    dispatchEvent('change', { value });
  },

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
  }
});


const onCreated = ({el, settings}) => {
};

const onRendered = function({tpl, isClient}) {
  if(true || isClient) {
    tpl.calculateActiveValue();
  }
};

const events = {
  'click menu-item'({tpl, data}) {
    tpl.setValue(data.value);
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
