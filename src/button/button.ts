import { html, unsafeCSS } from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { UIComponent } from '../lib/ui-component.js';
import { isEqual } from '../lib/utils.js';

import ButtonDefinition from './definition/definition.json';
import ButtonTemplate from './button.html';
import ButtonCSS from './button.css';

@customElement('ui-button')

class UIButton extends UIComponent {

  static get styles() {
    return unsafeCSS(ButtonCSS);
  }

  @property({
    attribute: false,
    type: Object,
    hasChanged: (a, b) => {
      console.log('has changed?', a, b);
      return true;
    }
  }) settings = {
    size: 'medium',
    emphasis: 'primary',
    icon: false,
    text: true,
  };

  on = {

    created() {
      console.log('on created');
    },

    settingChanged(...params) {
      console.log('on attribute change', params);
    },

    rendered() {
      setTimeout(() => {
        console.log('test');
        this.settings.emphasis = 'primary';
      }, 600);
    },

    moved() {
      console.log('moved from DOM');
    },

    destroyed() {
      console.log('on destroy');
    },

  };

  get = {
    buttonClass() {
      const settings = this.settings;
      return classMap({
        primary: (settings.emphasis == 'primary'),
        secondary: (settings.emphasis == 'secondary'),
        icon: false,
      });
    }
  };

  template() {
    console.log('template');
  }

  render() {
    let icon;
    let text;
    let label;

    if(this.settings?.icon) {
      icon = html`
        <span class="icon">
          <slot name="icon"></slot>
        </span>
      `;
    }

    if(this.settings?.text) {
      text = html`
        <span class="text" name="text">
          <slot></slot>
        </span>
      `;
    }

    if(this.settings?.label) {
      label = html`
        <span class="label">
          <slot name="label"></slot>
        </span>
      `;
    }
    return html`
      <div class="${this.get.buttonClass.apply(this)} button" name="button" tabindex="0">
        ${icon}
        ${text}
        ${label}
      </div>
    `;
  }

}

export {
  UIButton
};
