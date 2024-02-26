import { createComponent } from '@semantic-ui/component';
import template from './SidebarMenu.html?raw';
import css from './SidebarMenu.css?raw';

const createInstance = function (params) {
  return {};
};

const onCreated = function (params) {};

const onDestroyed = function (params) {};

const onRendered = function (params) {};

const events = {
  // test events
  'click .title'(params) {
    console.log('click title', this, params);
  },
};

const SidebarMenu = createComponent({
  tagName: 'sidebar-menu',
  template,
  css,
  createInstance,
  onCreated,
  onDestroyed,
  onRendered,
  events,
});

export { SidebarMenu };
