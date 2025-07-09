import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

export const ContentEditor = defineComponent({
  tagName: 'content-editor',
  template,
  css,
});
