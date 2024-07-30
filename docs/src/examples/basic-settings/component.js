import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  name: 'Jack',
};

createComponent({
  tagName: 'name-card',
  template,
  css,
  settings,
});
