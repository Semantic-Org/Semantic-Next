import { createComponent } from '../lib/create-component.js';
import { ReactiveVar } from '../lib/reactive.js';
import { ButtonDefinition, ButtonTemplate, ButtonCSS } from './';

const UIButton = {

  createInstance: function(tpl, $) {
    return {
      property: true,
      anotherProp: '1',
      getLove() {
        return 'love';
      }
    };
  },

  onCreated: function(tpl) {
    // called when initially loaded before attached to DOM
    ReactiveVar.createReaction(() => {
      if(fun) {
        console.log('We have fun');
      }
      else {
        console.log('No fun!');
      }
    });
  },

  onRendered: function() {
    // called when rendered to DOM
  },

  onDestroyed: function() {
    // called when removed from DOM
  },

  events: {
    'click .button'(event, tpl) {
      tpl.$('.button')
        .css({
          color: 'red',
          backgroundColor: 'black',
        })
        .find('.text')
          .text('text')
      ;
    }
  }

};

createComponent('ui-button', {
  type: 'element',
  definition: ButtonDefinition,
  template: ButtonTemplate,
  css: ButtonCSS,
  ...UIButton,
});

export { UIButton };
