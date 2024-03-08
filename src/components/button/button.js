import { createComponent } from '@semantic-ui/component';

import ButtonCSS from './button.css?raw';
import ButtonTemplate from './button.html?raw';
import { ButtonSpec } from './spec/spec.js';

const createInstance = ({tpl, content, data, $}) => ({
  
  isIconBefore() {
    return data.icon && !data.iconAfter
  },
  isIconAfter() {
    return data.icon && data.iconAfter;
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
