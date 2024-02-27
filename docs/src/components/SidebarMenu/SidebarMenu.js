import { createComponent } from '@semantic-ui/component';
import template from './SidebarMenu.html?raw';
import css from './SidebarMenu.css?raw';

const settings = {
  menu: [],
};

const createInstance = function ({ tpl }) {
  return {};
};

const onCreated = function ({ tpl }) {
  console.log(tpl.data);
};

const onDestroyed = function ({ tpl }) {};

const onRendered = function ({ tpl }) {};

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
  settings,
  onCreated,
  onDestroyed,
  onRendered,
  events,
});

export { SidebarMenu };
