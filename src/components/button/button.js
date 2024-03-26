import { createComponent } from '@semantic-ui/component';
import { get } from '@semantic-ui/utils';

import ButtonCSS from './css/button-shadow.css?raw';
import ButtonTemplate from './button.html?raw';
import { ButtonSpec } from './spec/spec.js';

const createInstance = ({tpl, settings, $}) => ({
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
  getClasses() {
    const classes = [];
    if(!settings.inverted && (settings.emphasis)) {
      classes.push('inverted');
    }
    return classes.length > 0
      ? ' ' + classes.join(' ')
      : ''
    ;
  }

});


const onCreated = ({tpl}) => {

};

const events = {
  'click .button'({event, tpl, $}) {
    let $button = $(this);
    $button.blur();
  },
  'keydown .button'({event, tpl, $}) {
    let $button = $(this);
    if (tpl.isSubmitKey(event.keyCode)) {
      $button.addClass('pressed');
      event.preventDefault();
    }
    if(event.key == 'Escape') {
      $button.blur();
    }
  },
  'keyup .button'({event, tpl, $}) {
    let $button = $(this);
    if (tpl.isSubmitKey(event.keyCode)) {
      $button.removeClass('pressed');
    }
  }
};

export const UIButton = createComponent({
  tagName: 'ui-button',
  spec: ButtonSpec,
  template: ButtonTemplate,
  css: ButtonCSS,
  createInstance,
  onCreated,
  events,
});
