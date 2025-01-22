import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const settings = {
  src: '',
  title: '',
  description: '',
  price: 0
};

defineComponent({
  tagName: 'product-card',
  template,
  css,
  settings,
});
