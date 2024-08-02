import { createComponent } from '@semantic-ui/component';

import { buttons } from './buttons.js';

const template = `
<div class="number">
  <b>{{number}}</b>
  {{> buttons}}
</div>
`;

const css = `
  b {
    color: var(--primary-text-color);
  }
`;

const lightCSS = `
  number-adjust + number-adjust {
    margin-top: 1rem;
  }
`;

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
});
