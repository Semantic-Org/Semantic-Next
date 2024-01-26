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
      { name: 'First', age: 23 },
      { name: 'Second', age: 36 },
      { name: 'Third', age: 36 },
      { name: 'Fourth', age: 36 },
      { name: 'Fifth', age: 36 },
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
      name: 'Sixth',
      age: 36,
    }
  };
};


UIButton.onCreated = function(tpl) {

  setTimeout(() => {
    tpl.condition.set(true);
  }, 2000);
  setTimeout(() => {
    tpl.condition2.set(true);
  }, 4000);
  setTimeout(() => {
    tpl.condition3.set(true);
  }, 6000);
  setTimeout(() => {
    tpl.saying.set('goodbye');
  }, 6000);
  setTimeout(() => {
    console.log('add', tpl.newItem);
    tpl.items.unshift(tpl.newItem);
  }, 4000);

  setTimeout(() => {
    tpl.items.removeItem(2);
  }, 2000);
  setTimeout(() => {
    tpl.items.unshift(tpl.newItem);
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
