import { createComponent } from '@semantic-ui/component';
import { MenuComponentSpec } from '@semantic-ui/specs';;

import CSS from './css/menu-shadow.css?raw';
import Template from './menu.html?raw';

const createInstance = ({settings, dispatchEvent}) => ({

  setValue(value) {
    settings.value = value;
    dispatchEvent('change', value);
  }

});


const onCreated = ({settings}) => {
};

const onRendered = function({$}) {
};

const events = {
  'click menu-item'({tpl, data}) {
    tpl.setValue(data.id);
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
