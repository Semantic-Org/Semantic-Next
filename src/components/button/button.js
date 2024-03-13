import { createComponent } from '@semantic-ui/component';

import ButtonCSS from './button.css?raw';
import ButtonTemplate from './button.html?raw';
import { ButtonSpec } from './spec/spec.js';

const createInstance = ({tpl, content, settings, $}) => ({
  
  isIconBefore() {
    return settings.icon && !settings.iconAfter;
  },
  isIconAfter() {
    return settings.icon && settings.iconAfter;
  }

});


const onCreated = ({tpl}) => {
};

const events = {
  'click .button'({event, tpl, $}) {
  }
};

const UIButton = createComponent({
  tagName: 'ui-button',
  spec: ButtonSpec,
  template: ButtonTemplate,
  css: ButtonCSS,
  createInstance,
  onCreated,
  events,
});

export { UIButton };
