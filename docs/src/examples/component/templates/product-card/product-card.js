import { createComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createInstance = () => ({
  imageUrl: '/images/avatar/eve.png',
  title: 'Sample Product',
  description: 'This is a sample product description.',
  price: 19.99
});

createComponent({
  tagName: 'product-card',
  template,
  css,
  createInstance,
});
