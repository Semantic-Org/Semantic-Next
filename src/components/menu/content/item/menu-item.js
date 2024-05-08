import { createComponent } from '@semantic-ui/component';
import { MenuItemComponentSpec } from '@semantic-ui/specs';

import MenuItemCSS from './menu-item.css?raw';
import MenuItemTemplate from './menu-item.html?raw';

export const MenuItem = createComponent({
  tagName: 'menu-item',
  componentSpec: MenuItemComponentSpec,
  template: MenuItemTemplate,
  css: MenuItemCSS,
});
