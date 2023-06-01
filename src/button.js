import { SUIComponent } from './lib/sui-component.js';
import ButtonTemplate from './button/button.html';
import ButtonCSS from './button/button.css';

class UIButton extends SUIComponent {

  defaultSettings = {
    one: 'two',
  };

  template = ButtonTemplate;
  css = ButtonCSS;

  initialize(settings) {
    console.log(ButtonCSS);
    console.log(ButtonTemplate);
    // do something with settings
  }
}

customElements.define('ui-button', UIButton);

export {
  UIButton
};
