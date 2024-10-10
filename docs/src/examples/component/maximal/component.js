import {
  defineComponent,
  getText
} from '@semantic-ui/component';

const css = await getText('./component.css');
const lightCSS = await getText('./component-light.css');
const template = await getText('./component.html');
import { buttons } from './buttons.js';

/*
  In this maximalist example we move all inlined
  portions of a component into separate files
  for "enterprisification"
*/
import {
  createInstance,
  onCreated,
  onDestroyed,
  onThemeChanged,
  onAttributeChanged
} from './lifecycle.js';

import { settings } from './config.js';

defineComponent({
  tagName: 'number-adjust',
  subTemplates: { buttons },
  createInstance,
  onCreated,
  onDestroyed,
  onThemeChanged,
  onAttributeChanged,
  template,
  css,
  lightCSS,
  settings,
});
