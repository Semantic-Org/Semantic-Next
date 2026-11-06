import { defineComponent, getText, registerCSS } from '@semantic-ui/component';

const sharedCSS = await getText('./shared.css');
const css = await getText('./component.css');
const template = await getText('./component.html');

// register once, shared as a single constructed stylesheet across shadow roots
registerCSS('panel', sharedCSS);

defineComponent({
  tagName: 'info-panel',
  baseCSS: 'panel',
  template,
});

defineComponent({
  tagName: 'highlight-panel',
  baseCSS: 'panel',
  css,
  template,
});
