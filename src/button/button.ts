import { createComponent } from '@semantic-ui/component';
import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';

import { ButtonSpec, ButtonTemplate, ButtonCSS } from './';

const UIButton = {};

UIButton.createInstance = function(tpl, $) {
  return {
    text: true,

    word: 'bird',

    condition: new ReactiveVar(false),
    condition2: new ReactiveVar(false),
    condition3: new ReactiveVar(false),

    items: new ReactiveVar([
      { name: 'Jenny', age: 23 },
      { name: 'Jenny', age: 23 },
      { name: 'Jack', age: 36 },
    ]),

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
    let items = tpl.items.get();
    items.push({
      name: 'Albert',
      age: 99
    });
    tpl.items.set(items);
  }, 2000);
  Reaction.create((comp) => {
    console.log('items are', tpl.items.get());
  });
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
