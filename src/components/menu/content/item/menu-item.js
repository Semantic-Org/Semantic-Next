import { createComponent } from '@semantic-ui/component';

import ItemCSS from './menu-item.css?raw';
import ItemTemplate from './menu-item.html?raw';

const settings = {
  active: false,
};

export const MenuItem = createComponent({
  tagName: 'menu-item',
  settings,
  template: ItemTemplate,
  css: ItemCSS,
});
