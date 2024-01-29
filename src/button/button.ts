import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';

import { ButtonSpec, ButtonTemplate, ButtonCSS } from './';

const UIButton = {};

UIButton.createInstance = function(tpl, $) {
  return {
    text: true,

    word: 'bird',

    condition: new ReactiveVar(false),
    condition2: new ReactiveVar(false),
    condition3: new ReactiveVar(false),
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
    },

    newItem: {
      _id: 'f',
      name: 'Sixth',
      age: 36,
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
  spec: ButtonSpec,
  template: ButtonTemplate,
  css: ButtonCSS,
  ...UIButton,
});

export { UIButton };
