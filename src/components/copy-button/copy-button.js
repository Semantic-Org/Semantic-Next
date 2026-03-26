import { Tooltip, Transition } from '../../behaviors/index.js';
import { Icon } from '../../primitives/index.js';

import { defineComponent } from '@semantic-ui/component';
import { copyText } from '@semantic-ui/utils';
import css from './copy-button.css?raw';
import template from './copy-button.html?raw';

const defaultSettings = {
  text: '',
  icon: 'copy',
  copiedIcon: 'check',
  tooltip: true,
  animation: 'confirm',
  resetDelay: 2000,
  tooltipSettings: {
    delay: 0,
    hideDelay: 0,
    duration: 0,
  },
};

const defaultState = {
  copied: false,
};

const createComponent = ({ self, $, state, settings }) => ({
  getIcon() {
    return state.copied.get() ? settings.copiedIcon : settings.icon;
  },

  copy() {
    copyText(settings.text);
    state.copied.set(true);
    if (settings.animation) {
      $('ui-icon').transition(settings.animation);
    }
    if (settings.tooltip) {
      $('.copy-button').tooltip('set text', 'Copied!');
    }
    clearTimeout(self.resetTimer);
    self.resetTimer = setTimeout(() => {
      state.copied.set(false);
      if (settings.tooltip) {
        $('.copy-button').tooltip('set text', 'Copy');
      }
    }, settings.resetDelay);
  },
});

const onRendered = ({ $, settings, isClient }) => {
  if (!isClient || !settings.tooltip) { return; }
  $('.copy-button').tooltip({
    text: 'Copy',
    ...settings.tooltipSettings,
  });
};

const events = {
  'click .copy-button'({ self }) {
    self.copy();
  },
};

const onDestroyed = ({ self }) => {
  clearTimeout(self.resetTimer);
};

const CopyButton = defineComponent({
  tagName: 'copy-button',
  template,
  css,
  events,
  createComponent,
  onRendered,
  defaultSettings,
  defaultState,
  onDestroyed,
});

export default CopyButton;
export { CopyButton };
