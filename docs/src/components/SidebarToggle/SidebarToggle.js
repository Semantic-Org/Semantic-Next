import { defineComponent } from '@semantic-ui/component';
import { UIIcon } from '@semantic-ui/core';
import {} from '@semantic-ui/utils';
import css from './SidebarToggle.css?raw';
import template from './SidebarToggle.html?raw';

const defaultSettings = {
  collapsed: false,
  saveState: true,
  classTarget: 'html',
  sidebarClass: 'sidebar-collapsed',
  storeAs: 'sidebar-collapsed',
  collapseIcon: 'left chevron',
  showIcon: 'right chevron',
};

const defaultState = {};

const createComponent = ({ settings, self, $, isClient, dispatchEvent }) => ({
  toggleSidebar() {
    if (self.isCollapsed()) {
      self.openSidebar();
    }
    else {
      self.collapseSidebar();
    }
  },
  getTarget() {
    return $(settings.classTarget, { root: document });
  },

  isCollapsed() {
    return settings.collapsed;
  },
  openSidebar() {
    settings.collapsed = false;
    if (settings.classTarget) {
      self.getTarget().removeClass(settings.sidebarClass);
    }
    self.setSavedCollapsedState(false);
    dispatchEvent('open');
  },
  collapseSidebar() {
    settings.collapsed = true;
    if (settings.classTarget) {
      console.log('adding to', self.getTarget()), self.getTarget().addClass(settings.sidebarClass);
    }
    self.setSavedCollapsedState(true);
    dispatchEvent('collapse');
  },

  canSaveState() {
    return isClient && settings.saveState;
  },
  getSavedCollapsedState() {
    const setting = localStorage.getItem(settings.storeAs);
    return setting === 'true';
  },
  setSavedCollapsedState(state) {
    if (!self.canSaveState()) {
      return;
    }
    localStorage.setItem(settings.storeAs, state);
  },
});

const onRendered = ({ self, settings }) => {
  if (self.canSaveState()) {
    settings.collapsed = self.getSavedCollapsedState();
  }
};

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
  onRendered,
  defaultState,
  defaultSettings,
  events,
});

export default SidebarToggle;
export { SidebarToggle };
