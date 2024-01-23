import { createComponent } from '@semantic-ui/component';
import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';

import { ButtonSpec, ButtonTemplate, ButtonCSS } from './';

const UIButton = {};

UIButton.createInstance = function(tpl, $) {
  return {
    text: true,

    word: 'bird',

    saying: new ReactiveVar('hello'),

    hasIcon() {
      return tpl.data.icon;
    },

    format(expression) {
      return `Wrapping thing ${expression}`;
    },

    sayWord(word, word2) {
      return `This is ${word}. Second word is ${word2}`;
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
  setTimeout(() => {
    tpl.saying.set('goodbye');
  }, 2000);
};

UIButton.events = {
  'click .button'(event, tpl, $) {
    $('.button').addClass('red');
  }
};

createComponent('ui-button', {
  spec: ButtonSpec,
  template: ButtonTemplate,
  css: ButtonCSS,
  ...UIButton,
});

export { UIButton };
