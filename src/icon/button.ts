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
    saying: new ReactiveVar('hello'),
    items: new ReactiveVar([
      { _id: 'a', name: 'First', age: 23 },
      { _id: 'b', name: 'Second', age: 36 },
      { _id: 'c', name: 'Third', age: 36 },
      { _id: 'd', name: 'Fourth', age: 36 },
      { _id: 'e', name: 'Fifth', age: 36 },
    ]),


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

  setTimeout(() => {
    let items = tpl.items.get();
    items[0].name = 'Margaret';
    console.log('setting name to margaret');
    tpl.items.set(items);
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
