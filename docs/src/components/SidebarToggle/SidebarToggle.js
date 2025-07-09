import { defineComponent } from '@semantic-ui/component';
import { UIIcon } from '@semantic-ui/core';
import {} from '@semantic-ui/utils';
import css from './SidebarToggle.css?raw';
import template from './SidebarToggle.html?raw';

const defaultSettings = {
  collapsed: false,
  sidebarSelector: '',
  storeAs: 'sidebar-collapsed',
  collapseIcon: 'left chevron',
  showIcon: 'right chevron',
};

const defaultState = {};

const createComponent = ({ settings, self, $, dispatchEvent }) => ({
  toggleSidebar() {
    if (self.isCollapsed()) {
      self.openSidebar();
    }
    else {
      self.collapseSidebar();
    }
  },
  isCollapsed() {
    return settings.collapsed;
  },
  getSidebar() {
    return $(settings.sidebarSelector, { root: document });
  },
  openSidebar() {
    settings.collapsed = false;
    if (settings.sidebarSelector) {
      self.getSidebar().removeClass('collapsed');
    }
    dispatchEvent('open');
  },
  collapseSidebar() {
    settings.collapsed = true;
    if (settings.sidebarSelector) {
      self.getSidebar().addClass('collapsed');
    }
    dispatchEvent('collapse');
  },
});

const events = {
  'click .overlay': ({ self }) => {
    self.toggleSidebar();
  },
};

const SidebarToggle = defineComponent({
  tagName: 'sidebar-toggle',
  template,
  css,
  createComponent,
  defaultState,
  defaultSettings,
  events,
});

export default SidebarToggle;
export { SidebarToggle };
