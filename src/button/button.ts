import { createComponent } from '@semantic-ui/component';
import { Reaction, ReactiveVar } from '@semantic-ui/reactivity';

import { ButtonSpec, ButtonTemplate, ButtonCSS } from './';

const UIButton = {};

UIButton.createInstance = function(tpl, $) {
  return {
    items: new ReactiveVar([
      { name: 'Jenny', age: 23 },
      { name: 'Jack', age: 36 },
    ]),
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
  setTimeout(() => {
    let items = tpl.items.get();
    items.push({
      name: 'Stew',
      age: 59
    });
    tpl.items.set(items);
  }, 4000);
  Reaction.create((comp) => {
    console.log('items reactively updated to', tpl.items.get());
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
