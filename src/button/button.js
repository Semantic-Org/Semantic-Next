import { createComponent } from '@semantic-ui/component';

import ButtonCSS from './button.css';
import ButtonTemplate from './button.html';
import { ButtonSpec } from './spec/spec.js';

const createInstance = (tpl, $) => ({});

const onCreated = (tpl) => {
};

const events = {
  'click .button'(event, tpl, $) {
  },
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
