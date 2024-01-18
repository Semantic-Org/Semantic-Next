import { createComponent } from '../lib/create-component.js';
import { Reaction, ReactiveVar } from '../lib/reactive/';
import { ButtonSpec, ButtonTemplate, ButtonCSS } from './';

const UIButton = {};

UIButton.createInstance = (tpl, $) => ({

  text: true,

  saying: new ReactiveVar('hello'),

  hasIcon() {
    return tpl.data.icon;
  },

  getIcon() {
    return data.icon;
  },

  getSaying() {
    console.log('being called again', tpl.saying.get());
    return tpl.saying.get();
  }
});


UIButton.onCreated = function(tpl) {
  setTimeout(() => {
    // test reactivity
    tpl.saying.set('goodbye');
  }, 1000);
};


UIButton.events = {
  'click .button'(event, tpl) {
    tpl.$('.button')
      .css({
        color: 'red',
        backgroundColor: 'black',
      })
      .find('.text').text('text')
    ;
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
