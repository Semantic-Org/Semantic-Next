import { UIComponent } from '../lib/ui-component.js';
import { html, unsafeCSS } from 'lit';
import {customElement, property} from 'lit/decorators.js';

import ButtonDefinition from './definition/definition.json';
import ButtonTemplate from './button.html';
import ButtonCSS from './button.css';

@customElement('ui-button')

class UIButton extends UIComponent {

  static get styles() {
    return unsafeCSS(ButtonCSS);
  }

  static get properties() {
    return {};
  }

  settings = {
    size: 'medium',
    icon: false,
  };

  on = {

    created() {
      console.log('on created');
    },

    settingChanged(...params) {
      console.log('on attribute change', params);
    },

    rendered() {
      console.log('on render');
    },

    moved() {
      console.log('moved from DOM');
    },

    destroyed() {
      console.log('on destroy');
    },

  };

  template() {
    console.log('template');
  }

  render() {
    console.log('html', html);
    return html`
      <div class="primary button" name="button" tabindex="0">
        <slot name="icon"></slot>
        <span class="text" name="text">
          <slot></slot>
        </span>
        <slot name="label"></slot>
      </div>
    `;
  }

}

export {
  UIButton
};
