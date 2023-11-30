import { SUIComponent, getAllowedAttributes } from '../lib/sui-component.js';

import ButtonDefinition from './definition/definition.json';
import ButtonTemplate from './button.html';
import ButtonCSS from './button.css';

class UIButton extends SUIComponent {

  static get observedAttributes() {
    return getAllowedAttributes(ButtonDefinition);
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

  render() {
  }

}

customElements.define('ui-button', UIButton);

export {
  UIButton
};
