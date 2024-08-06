import { createComponent, getText } from '@semantic-ui/component';

// component stores in separate files
import { createInstance, onCreated, onDestroyed, onThemeChanged, onAttributeChanged } from './lifecycle.js';
const css = await getText('./component.css');
const lightCSS = await getText('./component-light.css');
const template = await getText('./component.html');

// subtemplates
import { buttons } from './buttons.js';

createComponent({
  tagName: 'number-adjust',
  delegatesFocus: true,
  createInstance,
  onCreated,
  onDestroyed,
  onThemeChanged,
  onAttributeChanged,
  template,
  css,
  lightCSS,
  settings: { number: 0 },
  subTemplates: {
    buttons
  }
});
