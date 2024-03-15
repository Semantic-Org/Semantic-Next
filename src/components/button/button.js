import { createComponent } from '@semantic-ui/component';

import ButtonCSS from './button.css?raw';
import ButtonTemplate from './button.html?raw';
import { ButtonSpec } from './spec/spec.js';

const createInstance = ({tpl, settings, $}) => ({
  
  isIconBefore() {
    return settings.icon && !settings.iconAfter;
  },
  isIconAfter() {
    return settings.icon && settings.iconAfter;
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
    if (event.key === 'Enter') {
      $button.addClass('pressed');
    }
  },
  'keyup .button'({event, tpl, $}) {
    let $button = $(this);
    if (event.key === 'Enter') {
      $button.removeClass('pressed');
    }
  }
};

const UIButton = createComponent({
  tagName: 'ui-button',
  spec: ButtonSpec,
  template: ButtonTemplate,
  delegateFocus: true,
  css: ButtonCSS,
  createInstance,
  onCreated,
  events,
});

const UIButtons = createComponent({
  tagName: 'ui-buttons',
  spec: ButtonSpec,
  template: ButtonTemplate,
  delegateFocus: true,
  plural: true,
  css: ButtonCSS,
  createInstance,
  onCreated,
  events,
});

export { UIButton, UIButtons };
