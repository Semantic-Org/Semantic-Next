import { createComponent } from '@semantic-ui/component';
import { MenuItemComponentSpec } from '@semantic-ui/specs';

import MenuItemCSS from './menu-item.css?raw';
import MenuItemTemplate from './menu-item.html?raw';

const events = {
  'touchstart .menu'({event, tpl, $}) {
    $(this).addClass('pressed');
  },
  'touchend .menu'({event, tpl, $}) {
    $(this).removeClass('pressed');
  },
};

export const MenuItem = createComponent({
  tagName: 'menu-item',
  events: events,
  componentSpec: MenuItemComponentSpec,
  template: MenuItemTemplate,
  css: MenuItemCSS,
});
