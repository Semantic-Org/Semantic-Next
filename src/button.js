import {
  SUIComponent,
  getAttributesFromUIDefinition
} from './lib/sui-component.js';

import { ButtonDefinition } from './button/button-definition.js';
import ButtonTemplate from './button/button.html';
import ButtonCSS from './button/button.css';

class UIButton extends SUIComponent {

  static get observedAttributes() {
    return getAttributesFromUIDefinition(ButtonDefinition);
  }

  defaultSettings = {
    one: 'two',
  };

  definition = ButtonDefinition;
  template = ButtonTemplate;
  css = ButtonCSS;

  initialize(settings) {
    // do something with settings
  }

}

customElements.define('ui-button', UIButton);

export {
  UIButton
};
