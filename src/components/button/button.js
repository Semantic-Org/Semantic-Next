import { defineComponent } from '@semantic-ui/component';
import { get, inArray } from '@semantic-ui/utils';

import componentSpec from './specs/button-component.json' with { type: 'json' };
import template from './button.html?raw';
import css from './button-bundle.css?raw';

const createComponent = ({ el, self, settings, data, $ }) => ({
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
  performAction() {
    const formActions = ['submit', 'reset'];
    if(inArray(settings.type, formActions)) {
      const form = self.getForm();
      if(form) {
        $(form).trigger(settings.type);
      }
    }
  },
  getForm() {
    return $(el).closest('form').el();
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
    self.performAction();
    $(this).blur();
  },
  'keydown .button'({ event, self, $ }) {
    let $button = $(this);
    if (self.isSubmitKey(event.keyCode)) {
      $button.addClass('pressed');
      self.performAction();
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
