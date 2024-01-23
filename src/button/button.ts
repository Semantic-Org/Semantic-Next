import { createComponent } from '@semantic-ui/component';
import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';

import { ButtonSpec, ButtonTemplate, ButtonCSS } from './';

const UIButton = {};

UIButton.createInstance = function(tpl, $) {
  return {
    text: true,

    saying: new ReactiveVar('hello'),

    hasIcon() {
      return tpl.data.icon;
    },

    getIcon() {
      return data.icon;
    },

    getText() {
      return $('.button').text();
    },

    getSaying() {
      return tpl.saying.get();
    }
  };
};


UIButton.onCreated = function(tpl) {


};

UIButton.events = {
  'click .button'(event, tpl, $) {
    $('.button').addClass('red');
  }
};

createComponent('ui-button', {
  type: 'element',
  spec: ButtonSpec,
  template: ButtonTemplate,
  css: ButtonCSS,
  ...UIButton,
});

export { UIButton };
