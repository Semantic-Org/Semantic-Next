import { createComponent } from '@semantic-ui/component';
import template from './SidebarMenu.html?raw';
import css from './SidebarMenu.css?raw';

const createInstance = function (tpl, $) {
  return {};
};

const onCreated = (tpl) => {};

const onDestroyed = (tpl) => {
  // test destroyed
};

const events = {
  // test events
  'click .title'(event, tpl) {
    console.log('title clicked');
  },
};

const SidebarMenu = createComponent({
  tagName: 'sidebar-menu',
  template,
  css,
  createInstance,
  onCreated,
  onDestroyed,
  events,
});

export { SidebarMenu };
