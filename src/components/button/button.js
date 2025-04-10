import { defineComponent } from '@semantic-ui/component';
import { get } from '@semantic-ui/utils';

import componentSpec from './spec/button-component.json' assert { type: 'json' };
import template from './button.html?raw' assert { type: 'txt' };
import css from './button-bundle.css?raw' assert { type: 'css' };

const createComponent = ({ self, settings, data, el, $ }) => ({
  isIconBefore() {
    return settings.icon && !settings.iconAfter;
  },
  isIconAfter() {
    return settings.icon && settings.iconAfter;
  },
  isSubmitKey(keyCode) {
    const submitKeys = {
      13: 'Space',
      32: 'Enter',
    };
    return get(submitKeys, String(keyCode));
  },
  isDisabled() {
    return settings.state == 'disabled';
  },
});

const events = {
  'touchstart .button'({ event, self, $ }) {
    $(this).addClass('pressed');
  },
  'touchend .button'({ event, self, $ }) {
    $(this).removeClass('pressed');
  },
  'click .button'({ event, self, $ }) {
    $(this).blur();
  },
  'keydown .button'({ event, self, $ }) {
    let $button = $(this);
    if (self.isSubmitKey(event.keyCode)) {
      $button.addClass('pressed');
      event.preventDefault();
    }
    if (event.key == 'Escape') {
      $button.blur();
    }
  },
  'keyup .button'({ event, self, $ }) {
    let $button = $(this);
    if (self.isSubmitKey(event.keyCode)) {
      $button.removeClass('pressed');
    }
  },
};

export const UIButton = defineComponent({
  tagName: 'ui-button',
  componentSpec,
  template,
  css,
  createComponent,
  events,
});
