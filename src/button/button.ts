import { createComponent } from '@semantic-ui/component';
import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';

import { ButtonSpec, ButtonTemplate, ButtonCSS } from './';

const UIButton = {};

UIButton.createInstance = function(tpl, $) {
  return {
    items: new ReactiveVar([
      { name: 'First', age: 23 },
      { name: 'Second', age: 36 },
      { name: 'Third', age: 36 },
      { name: 'Fourth', age: 36 },
      { name: 'Fifth', age: 36 },
    ]),

    newItem: {
      name: 'Sixth',
      age: 36,
    }

  };
};


UIButton.onCreated = function(tpl) {

  setTimeout(() => {
    console.log('add', tpl.newItem);
    tpl.items.unshift(tpl.newItem);
  }, 4000);
  setTimeout(() => {
    console.log('add', tpl.newItem);
    tpl.items.unshift(tpl.newItem);
  }, 4000);
  setTimeout(() => {
    console.log('add', tpl.newItem);
    tpl.items.unshift(tpl.newItem);
  }, 4000);

  setTimeout(() => {
    let items = tpl.items.get();
    items[0].name = 'Jack';
    tpl.items.set(items);
  }, 2000);

  Reaction.create((comp) => {
    let items = Reaction.nonreactive(() => {
      console.log('items reactively updated to', tpl.items.get());
    });
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
