import { defineComponent } from '@semantic-ui/component';
import { MenuItemComponentSpec } from '@semantic-ui/specs';

import MenuItemCSS from './menu-item.css?raw';
import MenuItemTemplate from './menu-item.html?raw';

const onCreated = ({data}) => {

};

const events = {
  'touchstart .menu'({event, tpl, $}) {
    $(this).addClass('pressed');
  },
  'touchend .menu'({event, tpl, $}) {
    $(this).removeClass('pressed');
  },
};

export const MenuItem = defineComponent({
  tagName: 'menu-item',
  events: events,
  onCreated,
  componentSpec: MenuItemComponentSpec,
  template: MenuItemTemplate,
  css: MenuItemCSS,
});
