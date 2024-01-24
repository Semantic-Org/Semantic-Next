import { createComponent } from '@semantic-ui/component';
import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';

import { ButtonSpec, ButtonTemplate, ButtonCSS } from './';

const UIButton = {};

UIButton.createInstance = function(tpl, $) {
  return {
    text: true,

    word: 'bird',

    foo: {
      saying: new ReactiveVar('hello'),
    },


    hasIcon() {
      return tpl.data.icon;
    },

    format(expression) {
      return `The whole sentence is "${expression}"`;
    },

    sayWord(word, word2, word3) {
      return `Left word is ${word}. Right word is ${word2}. The third word is ${word3 || 'not set'}`;
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
    tpl.foo.saying.set('goodbye');
  }, 1000);
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
