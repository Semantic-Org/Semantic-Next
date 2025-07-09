import { defineComponent, getText } from '@semantic-ui/component';

const pageCSS = await getText('./component-page.css');
const css = await getText('./component.css');
const template = await getText('./component.html');

defineComponent({
  tagName: 'responsive-grid',
  template,
  css,
  pageCSS,
});
