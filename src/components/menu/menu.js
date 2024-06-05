import { createComponent } from '@semantic-ui/component';
import { MenuComponentSpec } from '@semantic-ui/specs';

import CSS from './css/menu-shadow.css?raw';
import Template from './menu.html?raw';

const createInstance = ({settings, tpl, dispatchEvent}) => ({

  setValue(value) {
    settings.value = value;
    dispatchEvent('change', { value });
  },

  getValue(item) {
    return item.value || item.href;
  },

  isValueActive(activeValue, item) {
    if(item.active) {
      return true;
    }
    if(activeValue !== undefined) {
      return activeValue == tpl.getValue(item);
    }
    return false;
  }
});


const onCreated = ({settings}) => {
};

const onRendered = function({$}) {
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
