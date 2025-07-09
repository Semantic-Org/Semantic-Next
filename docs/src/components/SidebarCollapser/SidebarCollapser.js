import { defineComponent } from '@semantic-ui/component';
import { UIIcon } from '@semantic-ui/core';
import {} from '@semantic-ui/utils';
import css from './SidebarCollapser.css?raw';
import template from './SidebarCollapser.html?raw';

const defaultSettings = {
  collapsed: false,
};

const defaultState = {};

const createComponent = ({ settings, self, $, dispatchEvent }) => ({});

const events = {
  'click .toggle': ({ target, settings, $ }) => {
  },
};

const SidebarCollapser = defineComponent({
  tagName: 'sidebar-collapser',
  template,
  css,
  createComponent,
  defaultState,
  defaultSettings,
  events,
});

export default SidebarCollapser;
export { SidebarCollapser };
