import { createComponent, getText } from '@semantic-ui/component';

const template = await getText('./component.html');

const TestElement = createComponent({
  tagName: 'test-element',
  template,
});

export { TestElement };
