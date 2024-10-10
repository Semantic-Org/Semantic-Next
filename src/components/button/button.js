import { defineComponent } from '@semantic-ui/component';
import { get } from '@semantic-ui/utils';
import { ButtonComponentSpec } from '@semantic-ui/specs';

import ButtonCSS from './css/button-shadow.css?raw' assert { type: 'css'};
import ButtonTemplate from './button.html?raw' assert { type: 'txt'};

const createInstance = ({self, settings, data, el, $}) => ({
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
  }
});


const onCreated = ({self}) => {

};
const onRendered = function({self}){

};

const events = {
  'touchstart .button'({event, self, $}) {
    $(this).addClass('pressed');
  },
  'touchend .button'({event, self, $}) {
    $(this).removeClass('pressed');
  },
  'click .button'({event, self, $}) {
    $(this).blur();
  },
  'keydown .button'({event, self, $}) {
    let $button = $(this);
    if (self.isSubmitKey(event.keyCode)) {
      $button.addClass('pressed');
      event.preventDefault();
    }
    if(event.key == 'Escape') {
      $button.blur();
    }
  },
  'keyup .button'({event, self, $}) {
    let $button = $(this);
    if (self.isSubmitKey(event.keyCode)) {
      $button.removeClass('pressed');
    }
  }
};

export const UIButton = defineComponent({
  tagName: 'ui-button',
  componentSpec: ButtonComponentSpec,
  template: ButtonTemplate,
  css: ButtonCSS,
  createInstance,
  onCreated,
  onRendered,
  events,
});
