import { defineComponent } from '@semantic-ui/component';

// include some page css alongside the component
// move a portion of template to a subtemplate for maximalist effect
import { buttons } from './buttons.js';

/*
  In this maximalist example we move all inlined
  portions of a component into separate files
  for "enterprisification"
*/
import {
  createComponent,
  onAttributeChanged,
  onCreated,
  onDestroyed,
  onThemeChanged
} from './lifecycle.js';

import { defaultSettings } from './config.js';

import css from './component.css?raw';
import template from './component.html?raw';
import pageCSS from './component-page.css?raw';
export const NumberAdjust = defineComponent({
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
