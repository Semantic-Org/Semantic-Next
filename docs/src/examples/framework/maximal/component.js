import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

// include some page css alongside the component
const pageCSS = await getText('./component-page.css');

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
