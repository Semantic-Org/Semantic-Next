import {
  SUIComponent,
  getAllowedAttributes,
} from './lib/sui-component.js';

import ButtonDefinition from './button/definition/definition.json';
import ButtonTemplate from './button/button.html';
import ButtonCSS from './button/button.css';

console.log(ButtonCSS);

class UIButton extends SUIComponent {

  static get observedAttributes() {
    return getAllowedAttributes(ButtonDefinition);
  }

  defaultSettings = {
    one: 'three',
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
