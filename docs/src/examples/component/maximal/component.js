import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const pageCSS = await getText('./component-page.css');
const template = await getText('./component.html');
import { buttons } from './buttons.js';

/*
  In this maximalist example we move all inlined
  portions of a component into separate files
  for "enterprisification"
*/
import {
  createComponent,
  onCreated,
  onDestroyed,
  onThemeChanged,
  onAttributeChanged
} from './lifecycle.js';

import { defaultSettings } from './config.js';

defineComponent({
  tagName: 'number-adjust',
  subTemplates: { buttons },
  createComponent,
  onCreated,
  onDestroyed,
  onThemeChanged,
  onAttributeChanged,
  template,
  css,
  pageCSS,
  defaultSettings,
});
