import { createComponent } from '@semantic-ui/component';

import ItemCSS from './menu-item.css?raw';
import ItemTemplate from './menu-item.html?raw';

export const MenuItem = createComponent({
  tagName: 'menu-item',
  template: ItemTemplate,
  css: ItemCSS,
});
