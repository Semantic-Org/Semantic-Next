import { createComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');
const css = await getText('./component.css');

const TestElement = createComponent({
  tagName: 'test-element',
  template,
  css,
});

export { TestElement };
