import { createComponent } from '../lib/create-component.js';
import _ from '../lib/utils.js';

import ButtonDefinition from './definition/definition.json';
import ButtonCSS from './button.css';

const Button = {};

Button.template = `
  {{#if icon}}
    <span class="icon">
      {{slot icon}}
    </span>
  {{elseif not icon}}
    woo
  {{else}}
    no icon
  {{/if}}
  {{#if text}}
    <span class="text">
      {{slot text}}
    </span>
  {{/if}}
  {{#if label}}
    <span class="label">
      {{slot label}}
    </span>
  {{/if}}
`;

/*
Button.template = `
  <div class="primary button" name="button" tabindex="0">
    <span class="text">
      <slot></slot>
    </span>
  </div>
`;
*/
// define available attributes and behaviors from JSON spec
Button.onCreated = function(tpl, $) {
  return {
    property: true,
    anotherProp: '1',
    getLove() {
      return 'love';
    }
  };
};

Button.onRendered = function() {
  console.log('added to DOM');
};

Button.onDestroyed = function() {
  console.log('removed from DOM');
};

Button.events =  {
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
};

createComponent('ui-button', {
  type: 'element',
  css: ButtonCSS,
  definition: ButtonDefinition,
  ...Button,
});
